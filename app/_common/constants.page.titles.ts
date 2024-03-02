export module Constants {
    export class Page {
        static titles:  {[key: string]: string} = 
                                {                                    
                                    '/event-log/list' : 'Event Logs',
                                    '/event-types/add': 'Add Event Type',
                                    '/event-types' : 'Event Types',
                                    '/event-types/list' : 'Event Types',
                                    '/event-types/manage/': 'Update Event Type',
                                    '/event-types/edit-template/': 'Event Template',
                                    '/severity/add': 'Add Severity',
                                    '/severity' : 'Severities',
                                    '/severity/list' : 'Severities',
                                    '/severity/manage/': 'Update Severity',
                                    '/boundary-conditions/list': 'Boundary Conditions', 
                                    '/boundary-conditions/attributes/': 'Boundary Conditions Attributes',
                                    '/boundary-conditions': 'Boundary Conditions', 
                                    '/boundary-conditions/add': ' Add Boundary Conditions',
                                    '/boundary-conditions/manage/': 'Update Boundary Conditions',  
                                    '/validity-periods/list': 'Validity Periods', 
                                    '/validity-periods': 'Validity Periods', 
                                    '/validity-periods/add': ' Add Validity Period',
                                    '/validity-periods/manage/': 'Update Validity Period',                                                            
                                    '/boundary-service/boundary-conditions/': 'Boundary Condition',                                    
                                    '/auditlogs/list' : 'Audit Logs',
                                    '/devices/location' : 'Device Location',
                                    '/devices/telemetry' : 'Device Telemetry',
                                    '/maintenance/throttling-configuration': 'LIP Throttling Configuration',
                                    '/maintenance/purge-history': 'Purge History',
                                    '/maintenance/purge-deleteditems': 'Purge Details'
                                };

    }
}
