// import addMeetingSchema from
import { Request, Response } from 'express';
import addMeetingSchema from "../models/addMeeting.model";

exports.createMeeting = async (req: Request, res: Response) => {
    try {

        var meeting = new addMeetingSchema(req.body);
        await meeting.save();
        res.status(200).send({
            message: "created successfully",
            error: false,
            data: meeting
        });
    } catch (err) {
    console.log('error',err.name)
        if (err.errors && err.name == "ValidationError") {
            res.status(422).send({
                message: `User validation failed for ${err.message.split(":")[1]}`,
                error: err,
                status: false
            })
        }
        else {
            res.status(500).send({
                message: 'Something went wrong in creating FAQPage',
                error: err,
                status: false
            });
            console.log("err",err);
        }
    }
};