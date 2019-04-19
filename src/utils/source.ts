import Queue from "./queue";
import { Middleware } from '..';
import { RequestInit } from 'node-fetch';
import { scheduleJob, Job, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';


export type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string;
export interface ISourceContext {
    req: BaseRequest & RequestInit;
    url: string;
}
export type Request = string | (BaseRequest & RequestInit);
export interface BaseRequest {
    url: string;
    /**
     * Pass data to next request context, will be merged to `ctx.state`.
     */
    state?: Record<string, any>;
}

export default class Source {

    requests = new Queue<Request>();
    requesting: Request | undefined;
    schedules: Array<{ rule: ScheduleRule, request: Request }> = [];

    private _jobs: Job[] = [];


    isEmpty() {
        return this.requests.isEmpty();
    }

    /**
     * Add request(s) into queue.
     */
    enqueue(...requests: Request[]) {
        this.requests.enqueue(...requests);
        return this;
    }

    /**
     * Get a request from queue.
     */
    dequeue() {
        this.requesting = this.requests.dequeue();
        return this.requesting;
    }

    /**
     * Time-based request scheduling.
     * @see [node-schedule](https://github.com/node-schedule/node-schedule)
     */
    schedule(rule: ScheduleRule, request: Request) {
        this.schedules.push({ rule, request });
        this._jobs.push(scheduleJob(rule, () => this.enqueue(request)));

        return this;
    }

    toJSON() {
        const { requests, requesting, schedules } = this;
        return {
            requests: requests.toJSON(),
            requesting,
            schedules,
        };
    }

    request(): Middleware<{}, ISourceContext> {
        return async (ctx, next) => {
            const req = this.dequeue()!;

            ctx.req = typeof req === 'string' ? { url: req } : req;
            ctx.url = ctx.req.url;

            if (ctx.req.state != null) {
                Object.assign(ctx.state, ctx.req.state);
            }

            await next();
        }
    }
}
