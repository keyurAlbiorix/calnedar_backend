import { mongoose } from "../db/mongoose";

var addMeetingSchema = new mongoose.Schema(
{
        faqs: [{
            id: String,
            title: String,
            items: []
        }]
})

var meeting = mongoose.model("meeting",addMeetingSchema);
export default meeting

