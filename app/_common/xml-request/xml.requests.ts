export module XML.Requests {
    export class Login {
        static get loginRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Body>\
                    <MSSLogin xmlns="http://www.motorola.com/mes">\
                    <user>{user}</user>\
                    <password>{password}</password>\
                    </MSSLogin>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get logoutRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"\
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Body>\
                    <MSSLogout xmlns="http://www.motorola.com/mes">\
                    <token>{token}</token>\
                    </MSSLogout>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get addEventTypeRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <addEventType xmlns="http://www.motorola.com/mes">\
                    <name>{eventType}</name>\
                    <groupId>{groupId}</groupId>\
                    </addEventType>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getEventTypeListRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getEventTypes xmlns="http://www.motorola.com/mes" />\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getEventTypeGroupsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getEventTypeAvailableGroups xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    </getEventTypeAvailableGroups>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get updateEventTypeRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <updateEventType xmlns="http://www.motorola.com/mes">\
                    <ID>{eventId}</ID>\
                    <newName>{eventType}</newName>\
                    <newGroupID>{groupId}</newGroupID>\
                    </updateEventType>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeEventTypeRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <removeEventType xmlns="http://www.motorola.com/mes">\
                    <ID>{Id}</ID>\
                    </removeEventType>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getSeverityLevelsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getSeverityLevels xmlns="http://www.motorola.com/mes" />\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getTemplateSeveritiesRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getTemplateSeverities xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    </getTemplateSeverities>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getSeveritiesForEventTypeRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getSeveritiesForEventType xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    </getSeveritiesForEventType>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeSeverityFromTemplateRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <removeSeverityFromTemplate xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    <severityID>{SId}</severityID>\
                    </removeSeverityFromTemplate>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get addSeverityToTemplateRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <addSeverityToTemplate xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    <severityID>{SId}</severityID>\
                    </addSeverityToTemplate>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getSeverityActionsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getSeverityActions xmlns="http://www.motorola.com/mes">\
                    <typeID>{Id}</typeID>\
                    <severityID>{SId}</severityID>\
                    </getSeverityActions>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get createActionRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <createAction xmlns="http://www.motorola.com/mes">\
                    <URL>{url}</URL>\
                    <parameters>{parameters}</parameters>\
                    <message>{message}</message>\
                    <name>{name}</name>\
                    <maxUpdateTime>{max}</maxUpdateTime>\
                    <minUpdatetime>{min}</minUpdatetime>\
                    <triggers>{triggers}</triggers>\
                    <distance>{distance}</distance>\
                    <actionType>{actionType}</actionType>\
                    <severityID>{Sid}</severityID>\
                    <alertCode>{alertCode}</alertCode>\
                    <faultDescription>{fault}</faultDescription>\
                    <exePath>{exepath}</exePath>\
                    <deviceName>{deviceName}</deviceName>\
                    <send2EvtOrg>{sndEvtorg}</send2EvtOrg>\
                    </createAction>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get updateActionRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <updateAction xmlns="http://www.motorola.com/mes">\
                    <ID>{Id}</ID>\
                    <URL>{URL}</URL>\
                    <parameters>{parameters}</parameters>\
                    <message>{message}</message>\
                    <name>{name}</name>\
                    <maxUpdateTime>{max}</maxUpdateTime>\
                    <minUpdatetime>{min}</minUpdatetime>\
                    <triggers>{triggers}</triggers>\
                    <distance>{distance}</distance>\
                    <actionType>{actionType}</actionType>\
                    <groupID>{groupId}</groupID>\
                    <alertCode>{alertcode}</alertCode>\
                    <faultDescription>{fault}</faultDescription>\
                    <exePath>{exePath}</exePath>\
                    <deviceName>{deviceName}</deviceName>\
                    <send2EvtOrg>{sndEvtOrg}</send2EvtOrg>\
                    </updateAction>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get addActionToSeverityRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <addActionToSeverity xmlns="http://www.motorola.com/mes">\
                    <typeID>{TemplateId}</typeID>\
                    <severityID>{SeverityId}</severityID>\
                    <actionID>{ActionId}</actionID>\
                    <order>{TableOrder}</order>\
                    </addActionToSeverity>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeActionFromSeverityRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <removeActionFromSeverity xmlns="http://www.motorola.com/mes">\
                    <typeID>{typeId}</typeID>\
                    <severityID>{serverityId}</severityID>\
                    <actionID>{actionId}</actionID>\
                    </removeActionFromSeverity>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get addSeverityLevelRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <addSeverityLevel xmlns="http://www.motorola.com/mes">\
                    <name>{name}</name>\
                    <groupId>{groupId}</groupId>\
                    </addSeverityLevel>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get updateSeverityRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <updateSeverity xmlns="http://www.motorola.com/mes">\
                    <ID>{severityId}</ID>\
                    <newName>{name}</newName>\
                    <newGroupID>{groupId}</newGroupID>\
                    </updateSeverity>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeSeverityRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <removeSeverity xmlns="http://www.motorola.com/mes">\
                    <ID>{Id}</ID>\
                    </removeSeverity>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getSeverityAvailableGroupsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getSeverityAvailableGroups xmlns="http://www.motorola.com/mes">\
                    <severityID>{Id}</severityID>\
                    </getSeverityAvailableGroups>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getActionAvailableGroupsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getActionAvailableGroups xmlns="http://www.motorola.com/mes">\
                    <actionID>{Id}</actionID>\
                    </getActionAvailableGroups>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getEventListRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <getEventList xmlns="http://www.motorola.com/mes">\
                    <eventFilter>\
                    <IsOriginatorFilterApplied>{isOriginator}</IsOriginatorFilterApplied>\
                    <Originators>{originator}</Originators>\
                    <IsEventTypesFilterApplied>{isEventType}</IsEventTypesFilterApplied>\
                    <EventTypes>{eventType}</EventTypes>\
                    <IsSeveritiesFilterApplied>{isSeverity}</IsSeveritiesFilterApplied>\
                    <Severities>{severity}</Severities>\
                    <StartDate>{startDate}</StartDate>\
                    <EndDate>{endDate}</EndDate>\
                    <Acknowledge>{status}</Acknowledge>\
                    </eventFilter>\
                    <pageSize>{pageSize}</pageSize>\
                    <pageNum>{pageNum}</pageNum>\
                    </getEventList>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get acknowledgeEventRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Body>\
                    <acknowledgeEvent xmlns="http://www.motorola.com/mes">\
                    <eventID>{Id}</eventID>\
                    </acknowledgeEvent>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeEventRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mes">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <removeEvent xmlns="http://www.motorola.com/mes">\
                    <ID>{Id}</ID>\
                    </removeEvent>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getMotolocatorAPIPortRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Body>\
                    <getMotolocatorAPIPort xmlns="http://www.motorola.com/mes" />\
                    </soap:Body>\
                    </soap:Envelope>';
        }
    }
}