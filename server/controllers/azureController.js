const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');

require("dotenv").config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const credential = new DefaultAzureCredential();

const generateSasToken = async (req, res) => {
    // Retrieve the user ID and question ID from the request parameters
    const { userId, questionId } = req.params;

    try {
        // Check if the user ID or question ID is missing
        if (!userId || !questionId) {
            return res.status(400).json({ message: "User ID and question ID are required." });
        }

        console.log("Account name: ", accountName);

        // Connect to the Azure Blob Storage account
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);
        
        // Get a reference to the specific container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // Define the blob name using user ID and question ID
        const blobName = `${userId}/${questionId}.webm`;
        
        // Get a reference to the specific blob within the container
        const blobClient = containerClient.getBlobClient(blobName);
    
        // Set the SAS token expiration time to 1 hour from now
        const startsOn = new Date();
        const expiresOn = new Date();
        expiresOn.setHours(expiresOn.getHours() + 1);

        const userDelegationKey = await blobServiceClient.getUserDelegationKey(startsOn, expiresOn);

    
        // Define the SAS token options, including permissions and expiration
        const sasOptions = {
        containerName,
        permissions: BlobSASPermissions.parse("rw"), // read, write permissions
        startsOn,
        expiresOn,
        };
    
        // Generate the SAS token
        const sasToken = generateBlobSASQueryParameters(sasOptions, userDelegationKey, accountName).toString();
        
        // Constru the full URL to the blob with the SAS token
        const sasUrl = `${blobClient.url}?${sasToken}`;
    
        // Return the SAS URL
        res.json({ sasUrl });

    }
    catch (error) {
        console.error("Error generating SAS token:", error);
        res.status(500).json({ message: "Error generating SAS token" });
    }
  }
  

const azureController = {
    generateSasToken
};

module.exports = azureController;
