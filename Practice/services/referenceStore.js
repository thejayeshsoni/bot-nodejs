const { CosmosDbPartitionedStorage } = require('botbuilder-azure');

const { calculateChangeHash } = require('botbuilder-core');

let _refStore;
const CLASS_NAME = 'Reference Store';

function getCosmosConfig() {
    return {
        cosmosDbEndpoint: process.env.COSMOS_DB_ENDPOINT,
        authKey: process.env.COSMOS_DB_KEY,
        databaseId: process.env.COSMOS_DB_DATABASE_ID,
        containerId: process.env.COSMOS_DB_CONTAINER_ID,
    };
}

module.exports.getRefStore = function getRefStore(channelId) {
    try {
        if (channelId !== 'msteams') return;
        if (_refStore === undefined) {
            const cosmosDbPartitionedStorage = new CosmosDbPartitionedStorage(getCosmosConfig());
            _refStore = new ReferenceStore(cosmosDbPartitionedStorage, 'msteams' /* only for msteams channel */);
        }
        return _refStore;
    } catch (err) {
        console.log(`[Bot-Backend] [${CLASS_NAME}] Failed in getRefStore `, {
            CLASS_NAME: CLASS_NAME + ' - getRefStore',
            error: err
        });
    }
};

class ReferenceStore {
    constructor(storage, channelId, namespace = '') {
        this.storage = storage;
        this.channelId = channelId;
        this.namespace = namespace;
    }

    async getReference(userPrincipalName) {
        try {
            const key = this.getStorageKey(userPrincipalName);
            const items = await this.storage.read([key]);
            const conversationReference = items?.[key] || {};
            return conversationReference;
        } catch (err) {
            console.log(`[Bot-Backend] [${CLASS_NAME}] failed to get conversationReference`, {
                CLASS_NAME: CLASS_NAME + ' - conversationReference',
                error: err?.body
            });
        }
    }

    async setReference(userPrincipalName, conversationReference) {
        try {
            const key = this.getStorageKey(userPrincipalName);
            const item = {};
            item[key] = conversationReference;
            await this.storage.write(item);
        } catch (err) {
            console.log(`[Bot-Backend] [${CLASS_NAME}] failed to set Reference`, {
                CLASS_NAME: CLASS_NAME + ' - setReference',
                error: err?.body
            });
        }
    }

    async setReference(userPrincipalName, conversationReference, oldConversationReference) {
        const key = this.getStorageKey(userPrincipalName);
        if (calculateChangeHash(oldConversationReference) !== calculateChangeHash(conversationReference)) {
            const item = {};
            item[key] = conversationReference;
            await this.storage.write(item);
        }
    }

    async deleteReference(userPrincipalName) {
        const key = this.getStorageKey(userPrincipalName);
        return await this.storage.delete([key]);
    }

    // getStorageKey(userPrincipalName) {
    //     return `${this.channelId}/conv-reference/${fnv.hash(userPrincipalName.toLowerCase(), 64).hex()}/${this.namespace}`;
    // }
    getStorageKey(userPrincipalName) {
        return `${userPrincipalName?.toLowerCase()}`;
    }
}


module.exports.ReferenceStore = ReferenceStore;