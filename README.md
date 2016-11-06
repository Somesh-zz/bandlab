# Simple serverless application for bandlabs.

# Problem Statement:
- Create a Lambda function named “getComment”, triggered from an API Gateway
endpoint, with the path “/comments/:id”. This function does a REST call to
JSONPlaceholder by hitting the path “/comments/:id” returns the JSON back to the
client and stores the JSON response as a JSON file, locally. The name of the JSON file
is a generated uuid, e.g: 37e55e46-408a-4d09-9d7a-896b3d42da5e.json

- The JSON file should then be uploaded to S3 under a bucket named “inbox” under the
prefix “comments”.

- Create a Lambda function named “commentParser”, triggered by a S3 event from the S3
bucket named “inbox”. This function does download the file previously saved and parses
it in order to display its content in Cloudwatch logs.


# Comments
- 'index' bucket was not available hence 'bandlabsbucket' is used.
- Given aws-sdk with valid authorization and privileges, this code will work as expected.

#URL
https://mbh5ht1sc6.execute-api.us-east-1.amazonaws.com/dev/comments/{id}