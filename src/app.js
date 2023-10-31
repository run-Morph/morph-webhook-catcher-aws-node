require('dotenv').config();
const Morph = require('run-morph-client').Morph;

exports.handler = async (event, context) => {

    console.log(event.body)

    /*
    {
      "id": "THE_REQUEST_ID",
      "status": "card_view.requested",
      "context": {
        "service_id": "hubspot",
        "workspace_id": "123456789",
        "entity_type": "contact",
        "entity_id": "1234"
      }
    }
    */
    
    try {
       
        const request_id = JSON.parse(event.body).id;

        // Init Morph client with your API key
        let morph = new Morph(process.env.API_KEY, process.env.API_SECRET);

        // Load Morph's Card Builder to build a card response to the current request
        let cardBuilder = morph.newCardBuilder(request_id);
        
        // Create a new card
        let card = cardBuilder.newCard('Locally Crafted Card 🌽');

        card.newStatus('Status', 'Working', 'SUCCESS');

        // Build the cards
        let success = await cardBuilder.build(); 

        if(success) {
            return { 
                statusCode: 201, 
                body: JSON.stringify({ message: 'Card Created' }),
                headers: { 'Content-Type': 'application/json' }
            };
        } else {           
            return { 
                statusCode: apiResponse.status, 
                body: JSON.stringify({ 
                    message: "An error occurred when sending POST request to the API.", error: apiResponse.statusText })
            };
        }
    } catch (error) {
        console.log(JSON.stringify(error))
         return { 
            statusCode: 500, 
            body: JSON.stringify({
                message: 'An error occurred when fetching the request id or sending post request.',
                error: error.message
            }), 
            headers: { 'Content-Type': 'application/json' }
        };
    }
};
