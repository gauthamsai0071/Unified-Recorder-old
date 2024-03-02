export class LogEvent {
    Id: string
    EventType: string
    Severity: string
    Originator: string
    OccurrenceTime: string
    IsAcknowledge: string
    AckUrl: string
    CanAck: string
    Parameters: EventParameter[]
}

export class EventParameter {
    ParamName: string
    ParamValue: string
    ParamDescription: string
}