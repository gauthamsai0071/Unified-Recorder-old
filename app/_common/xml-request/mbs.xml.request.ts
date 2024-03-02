export module MBS.XML.Requests{
    export class MbSService{

        static get loginRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Body>\
                    <MSSLogin xmlns="http://www.motorola.com/mbs">\
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
                    <MSSLogout xmlns="http://www.motorola.com/mbs">\
                    <token>{token}</token>\
                    </MSSLogout>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get getValidityPeriodsRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mbs">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <GetValidityPeriods xmlns="http://www.motorola.com/mbs" />\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get removeValidityPeriodRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mbs">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <RemoveValidityPeriod xmlns="http://www.motorola.com/mbs">\
                    <validityPeriodID>{Id}</validityPeriodID>\
                    </RemoveValidityPeriod>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get addValidityPeriodRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mbs">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <AddValidityPeriod xmlns="http://www.motorola.com/mbs">\
                    <newValidityPeriod>\
                    <Name>{name}</Name>\
                    <ValidFrom>{validFrom}</ValidFrom>\
                    <ValidTo>{validTo}</ValidTo>\
                    <Monday>{day1}</Monday>\
                    <Tuesday>{day2}</Tuesday>\
                    <Wednesday>{day3}</Wednesday>\
                    <Thursday>{day4}</Thursday>\
                    <Friday>{day5}</Friday>\
                    <Description>{description}</Description>\
                    <Saturday>{day6}</Saturday>\
                    <Sunday>{day7}</Sunday>\
                    <Id>{id}</Id>\
                    <GroupId>{groupId}</GroupId>\
                    </newValidityPeriod>\
                    </AddValidityPeriod>\
                    </soap:Body>\
                    </soap:Envelope>';
        }

        static get updateValidityPeriodRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                    <soap:Header>\
                    <MSSSoapHeader xmlns="http://www.motorola.com/mbs">\
                    <Token>{token}</Token>\
                    </MSSSoapHeader>\
                    </soap:Header>\
                    <soap:Body>\
                    <UpdateValidityPeriod xmlns="http://www.motorola.com/mbs">\
                    <updatedValidityPeriod>\
                    <Name>{name}</Name>\
                    <ValidFrom>{validFrom}</ValidFrom>\
                    <ValidTo>{validTo}</ValidTo>\
                    <Monday>{day1}</Monday>\
                    <Tuesday>{day2}</Tuesday>\
                    <Wednesday>{day3}</Wednesday>\
                    <Thursday>{day4}</Thursday>\
                    <Friday>{day5}</Friday>\
                    <Description>{description}</Description>\
                    <Saturday>{day6}</Saturday>\
                    <Sunday>{day7}</Sunday>\
                    <Id>{id}</Id>\
                    <GroupId>{groupId}</GroupId>\
                    </updatedValidityPeriod>\
                    </UpdateValidityPeriod>\
                    </soap:Body>\
                    </soap:Envelope>';
        }
    }
}