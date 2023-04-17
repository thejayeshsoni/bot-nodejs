const CosmosClient = require('@azure/cosmos').CosmosClient;
const { CosmosDB } = require("./envConfig");

class CosmosDataBase {
    static client = null; // eslint-disable-line 
    static async Connection() {
        if (!CosmosDataBase.client) {
            let endpoint = CosmosDB.Endpoint;
            let key = CosmosDB.Key;
            CosmosDataBase.client = new CosmosClient({ endpoint, key });
        }
        return CosmosDataBase.client;
    }
    // async UpsertFeedBack(empID, payloadData) {
    //     try {
    //         let db = await CosmosDataBase.Connection();
    //         let querySpec = {
    //             query: `SELECT * FROM c Where c.id = @empID`,
    //             parameters: [{ name: '@empID', value: empID }]
    //         }
    //         let results = await db.database(CosmosDB.Database).container("conversationStateRef").items.query(querySpec).fetchAll();
    //         if (results.resources.length == 0) {
    //             return await db.database(CosmosDB.Database).container("conversationStateRef").items.upsert({ empID: empID, feedback: payloadData });
    //         } else {
    //             results.resources[0].feedback.push(payloadData[0]);
    //             let id = results.resources[0].id;
    //             return await db.database(CosmosDB.Database).container("BotFeedback").items.upsert({ empID: empID, feedback: results.resources[0].feedback, id: id });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    async Upsert(email, conversion) {
        try {
            let db = await CosmosDataBase.Connection();
            return await db.database(CosmosDB.Database).container("conversationStateRef").items.upsert({ id: email, conversion: conversion })
        } catch (err) {
            console.log(err);
        }
    }
    async Find(email) {
        let db = await CosmosDataBase.Connection();
        let querySpec = {
            query: 'SELECT * FROM c Where c.id = @email',
            parameters: [{ name: '@email', value: email }]
        }
        let results = await db.database(CosmosDB.Database).container("conversationStateRef").items.query(querySpec).fetchAll();
        return results ? results.resources : null;
    }
    // async GetAll() {
    //     let db = await CosmosDataBase.Connection();
    //     let querySpec = { query: 'SELECT r.conversion, r.id FROM DrishtiBot r' }
    //     let results = await db.database(CosmosDB.Database).container("DrishtiBot").items.query(querySpec).fetchAll();
    //     return results ? results.resources : null;
    // }
}

module.exports.CosmosDataBase = CosmosDataBase;