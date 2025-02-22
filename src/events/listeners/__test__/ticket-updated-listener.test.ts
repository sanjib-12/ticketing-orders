import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-update-listener";
import { TicketCreatedEvent } from "@sbmytickets/common";
import { Message } from "node-nats-streaming";

const setup = async () =>{
   // Create a listener
   const listener = new TicketUpdatedListener(natsWrapper.client);

   // Create and save a Ticket
   const ticket = Ticket.build({
      id: new  mongoose.Types.ObjectId().toHexString(),
      title: 'new concert',
      price: 100,
   })

   await ticket.save();

   // Create a fake data object
   const data: TicketCreatedEvent['data'] = {
         version : ticket.version + 1,
         id: ticket.id,
         title: 'new concert',
         price: 999,
         userId : 'asdf',
      }

   // Create a fake msg object
   // @ts-ignore
   const msg: Message = {
      ack: jest.fn()
   }

   // return all of this stuff
   return { msg, data, ticket, listener }
}

it('finds, updates, and saves a ticket', async() =>{
   const { msg, data, ticket, listener} = await setup();

   await listener.onMessage(data, msg);

   const updatedTicket = await Ticket.findById(ticket.id);

   expect(updatedTicket!.title).toEqual(data.title);
   expect(updatedTicket!.price).toEqual(data.price);
   expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async() => {
   const { msg, data, ticket, listener} = await setup();

   await listener.onMessage(data, msg);

   expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () =>{
   const { msg, data, listener, ticket } = await setup();
   
   data.version = 10;
   try{

      await listener.onMessage(data, msg);
   }catch (err){

   }
   expect(msg.ack).not.toHaveBeenCalled();

})