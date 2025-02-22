import { Publisher, Subjects, OrderCancelledEvent } from "@sbmytickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
   subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
} 