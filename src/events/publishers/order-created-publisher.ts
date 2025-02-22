import { Publisher, OrderCreatedEvent, Subjects } from "@sbmytickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
   subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

