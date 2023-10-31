## Morph Webhook Catcher (AWS Lambda - Node.js)

This project deploys an AWS Lambda function through an API Gateway to receive webhook events `card_view.requested` from Morph and generate a Card View response.

## Prerequisites

-  [Node.js 14.x](https://nodejs.org/en/download/)
-  [AWS CLI](https://aws.amazon.com/cli/)
-  [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
-  [Docker](https://www.docker.com/products/docker-desktop)
-  [ngrok](https://ngrok.com/download)

Make sure to [configure your AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) with your credentials.

## Setup

1. Clone this repository and navigate into it:
    ```bash
    git clone https://github.com/run-Morph/morph-webhook-catcher-aws-node.git
    cd morph-webhook-catcher-aws-node
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Replace `"your-bucket-name"` in `package.json` with the name of your actual S3 bucket.

4. Open the `template.yaml` file and replace `API_KEY` and `API_SECRET` placeholders in the `Environment` section under `Properties` with your actual API key and secret. 

    ```yaml
        Environment: 
            Variables:
                API_KEY: your-api-key
                API_SECRET: your-api-secret
    ```
    Replace `your-api-key` and `your-api-secret` with your actual key and secret.

5. Create a `.env` file in the root directory. Using your text editor, add your `API_KEY` and `API_SECRET` like this:

    ```env
    API_KEY=your-api-key
    API_SECRET=your-api-secret
    ```
    Again, replace `your-api-key` and `your-api-secret` with your actual key and secret.

## Testing Locally

1. Run the following command to start your API Gateway simulation at http://localhost:3000:
    ```bash
    npm run test
    ```

2. To test your Lambda function locally, send a POST request to your ngrok URL using the `/morph-webhook-catcher` path. 
First, retrieve the `request_id` from Morph's REST API by making a GET request to `/requests`. 

Here's an example using curl:

```bash
curl -d '{
  "id": "ADD_REQUEST_ID",
  "status": "card_view.requested",
  "context": {
    "service_id": "hubspot",
    "workspace_id": "123456789",
    "entity_type": "contact",
    "entity_id": "1234"
  }
}' -H "Content-Type: application/json" -X POST http://your-ngrok-url/morph-webhook-catcher
```

    Make sure to replace `http://your-ngrok-url` with the HTTPS URL provided by ngrok.

3.You will receive: `{"message": "Card Created"}`. 
If you check the request again using the Morph REST API `GET /requests/:request_id`, you should be able to see it.
```json
{
   
    "context": {
        "service_id": "hubspot",
        "workspace_id": "123456789",
        "entity_type": "contact",
        "entity_id": "1234"
    },
    "status": "completed",
    "response": {
        "type": "card_view",
        "card_view": {
            "root": {
                "actions": []
            },
            "cards": [
                {
                    "title": "Locally Crafted Card 🌽",
                    "contents": [
                        {
                            "label": "Status",
                            "type": "status",
                            "color": "SUCCESS",
                            "value": "Working"
                        }
                    ],
                    "actions": []
                }
            ]
        },
        "completed": true
    },
    "id": "THE_REQUEST_ID",
    "type": "card_view",
    "object": "request"
}
```

## Deploying to AWS

1. Package the application. This command will create a deployment package and save it in an S3 bucket:
    ```bash
    npm run package
    ```

2. Deploy the packaged application to AWS. This will create a CloudFormation stack and set up your AWS Lambda function and API Gateway:

    ```bash
    npm run deploy
    ```

## After Deployment

After deployment, your API Gateway will have a POST route at `https://your-api-id.execute-api.your-region.amazonaws.com/Prod/webhook` which can be used as your webhook URL. You can replace `your-api-id` and `your-region` with your actual API ID and region respectively.

## Usage

Send a POST request to your API Gateway endpoint or ngrok URL (for local testing) to trigger your AWS Lambda function. Your Lambda function will log the webhook data and return a success message. Please ensure that you have correctly set the `API_KEY` and `API_SECRET` as environment variables in both the `template.yaml` and the `.env` file for the application to work as expected.
