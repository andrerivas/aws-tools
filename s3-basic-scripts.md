# Basic S3 copy command
`aws s3 cp s3://SOURCE-BUCKET/images/thumb200x200/1481304150184-2110427762833493998.jpg s3://TARGET-BUCKET/images/thumb200x200/1481304150184-2110427762833493998.jpg --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z --acl public-read --cache-control max-age=2592000,public`

# Back up a bucket by copying
`aws s3 cp s3://SOURCE-BUCKET/ s3://TARGET-BUCKET/ --recursive`

# Simple S3 Query
```
aws s3api list-objects --bucket "SOURCE-BUCKET" --query 'Contents[?LastModified>=`2017-08-02`][].{Key: Key}'
```

# Update the metadata on all files in a bucket by copying to itself
```
aws s3 cp s3://TARGET-BUCKET/ s3://TARGET-BUCKET/ --recursive --metadata-directive REPLACE --expires 2034-01-01T00:00:00Z --acl public-read --cache-control max-age=2592000,public
```

# Check a file's ACL
```
aws s3api get-object-acl --bucket "SOURCE-BUCKET" --key "images/thumb200x200/1481304150184-2110427762833493998.jpg"
```

## MYSQL Dump / Restore
```
mysqldump --opt -u root -p DATABASE_NAME > file_name.sql
gzip file_name.sql
```

# Copy Locally via SCP:
```
scp -i "private-key.pem" ubuntu@instance.region.compute.amazonaws.com:file_name.sql.gz ~/file_name.sql.gz
```

# Then put it on the VM and extract it
# On the VM:
`mysql > CREATE DATABASE DATABASE_NAME;`

Then on the command line: 
```
# mysql -u root -p DATABASE_NAME < ~/Desktop/file_name.sql
```