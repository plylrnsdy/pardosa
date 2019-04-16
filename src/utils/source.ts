import Queue from "./queue";
import { IRequest } from '..';
import { scheduleJob, Job, RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from 'node-schedule';


type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string;

export default class Source {

    requests = new Queue<IRequest>();
    requesting: IRequest | undefined;
    schedules: Array<{ rule: ScheduleRule, request: IRequest }> = [];

    private _jobs: Job[] = [];

    constructor() {

    }

    /**
     * Add request(s) into queue.
     */
    enqueue(...requests: IRequest[]) {
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
    schedule(rule: ScheduleRule, request: IRequest) {
        this.schedules.push({ rule, request });
        this._jobs.push(scheduleJob(rule, () => this.enqueue(request)));

        return this;
    }

    cancelSchedule(index: number) {
        this.schedules.splice(index, 1);
        this._jobs.splice(index, 1)[0].cancel();

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
}
