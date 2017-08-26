var AWS = require("aws-sdk");
var IM = require('imagemagick');
var FS = require('fs');
var compressedJpegFileQuality = 0.85;
var compressedPngFileQuality = 0.85;
var cacheControl = "public,max-age=31536000";
var newWidth = "100%";
var newHeight = "100%";

 
exports.handler = (event, context, callback) => {
    var s3 = new AWS.S3();
    var sourceBucket = process.env.S3_BUCKET_SOURCE; // These env vars must be set in the Lambda config
    var destinationBucket = process.env.S3_BUCKET_TARGET; // These env vars must be set in the Lambda config
    var objectKey = event.Records[0].s3.object.key;
    var getObjectParams = {
        Bucket: sourceBucket,
        Key: objectKey
    };
    s3.getObject(getObjectParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log("S3 object retrieval get successful.");
            
            // Make sure this has not been optimized yet
            if (data.Metadata['x-amz-meta-compressed'] == "true")
            {
                console.log("S3 Object was already compressed.");
                return;
            }
            
            var resizedFileName = "/tmp/" + objectKey.split('/').pop();
            var quality;
            if (resizedFileName.toLowerCase().includes("png")){
                quality = compressedPngFileQuality;
            }
            else {
                quality = compressedJpegFileQuality;
            }

            // Customize size below
            var resize_req = { width: newWidth, height: newHeight, 
                                srcData: data.Body, 
                                dstPath: resizedFileName, 
                                quality: quality, 
                                progressive: true, 
                                strip: false,
                                sharpening: 0
            };
            IM.resize(resize_req, function(err, stdout) {
                if (err) {
                    console.log("Error resizing");
                    throw err;
                }
                console.log('stdout:', stdout);
                var content = new Buffer(FS.readFileSync(resizedFileName));
                var uploadParams = { Bucket: destinationBucket, 
                                        Key: objectKey, Body: content, 
                                        ContentType: data.ContentType,
                                        CacheControl: cacheControl, 
                                        ACL: "public-read",
                                        StorageClass: "STANDARD",
                                        Metadata: {
                                            "x-amz-meta-compressed": "true"
                                        }
                };
                s3.upload(uploadParams, function(err, data) {
                    if (err) {
                        console.log("Error uploading file");
                        console.log(err, err.stack);
                    } else{
                        console.log("S3 compressed object upload successful.");
                    }
                });
            });
        }
    });
};