import {Order} from '../model/order'
import {UserProfile} from '../model/userProfile'
import { MongoClient } from "mongodb";

export class OrderAssignerService {

    static dbName = "izinga-prod"
    static url = "mongodb+srv://onusmongouser:wfsuser@cluster0-7odiz.mongodb.net/izinga-prod?retryWrites=true&w=majority"
    

    static async assignDriver(mobileNumer: string, orderId: string) {
        var mongoClient =  await MongoClient.connect(this.url);
        const database = mongoClient.db(this.dbName);

        //find driver exist
        var driver = await this.findDriver(mobileNumer, mongoClient)
        if(driver?.name == null || driver?.role != "MESSENGER") {
            throw Error(`No driver found with id ${mobileNumer}`)
        }

        console.log(JSON.stringify(driver))

        //update order
        const filter = {"description" : {$regex : orderId}}
        const orders = database.collection<Order>("order");
        const updateDoc = {
            $set: { "shippingData.messengerId": driver?._id }
        };
        const options = { upsert: false };  
        await orders.updateOne(filter, updateDoc, options);
        return await orders.findOne<Order>(filter);
    }

    private static async findDriver(mobileNumber : string, mongoClient: MongoClient) {
        var drivers = mongoClient.db(this.dbName).collection("userProfile")
        const query = { mobileNumber: mobileNumber };
        return await drivers.findOne<UserProfile>(query);
    }
}