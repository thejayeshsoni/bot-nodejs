const { CosmosDbPartitionedStorage } = require("botbuilder-azure");

const cosmosDB = new CosmosDbPartitionedStorage({
    cosmosDbEndpoint: process.env.COSMOS_DB_ENDPOINT,
    authKey: process.env.COSMOS_DB_KEY,
    databaseId: process.env.COSMOS_DB_DATABASE_ID,
    containerId: process.env.COSMOS_DB_CONTAINER_ID
});

async function read(key) {
    this.cosmosDB.read([key]);
}
// async function getStorageKey(userPrincipalName) {
//     return `${this.channelId}/conv-reference/${userPrincipalName?.toLowerCase()}/${this.namespace}`;
// }

module.exports.getReference = async function getReference(userPrincipalName) {
    const key = this.getStorageKey(userPrincipalName);
    const items = await cosmosDB.read([key]);
    const conversationReference = items[key] || {};
    return conversationReference;
};

module.exports.setReference = async function setReference(userPrincipalName, conversationReference) {
    const key = userPrincipalName;
    const item = {};
    item[key] = conversationReference;
    await this.cosmosDB.write(item);

};