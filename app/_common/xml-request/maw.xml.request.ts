export module MAW.XML.Requests{
    export class MAWService{        

      static get loginRequest(): string {
        return '<?xml version="1.0" encoding="utf-8"?>\
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\
                xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                <MSSLogin xmlns="http://www.motorola.com/maw">\
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
                <MSSLogout xmlns="http://www.motorola.com/maw">\
                <token>{token}</token>\
                </MSSLogout>\
                </soap:Body>\
                </soap:Envelope>';
    }
          static get getDevicesDataRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
              <soap:Header>\
                <MSSSoapHeader xmlns="http://tempuri.org/">\
                  <Token>{token}</Token>\
                </MSSSoapHeader>\
              </soap:Header>\
              <soap:Body>\
                <GetDevicesData xmlns="http://tempuri.org/">\
                  <deviceIds>\
                    {devicesIdsdata}\
                  </deviceIds>\
                  <startDate>{startdatetime}</startDate>\
                  <endDate>{enddatetime}</endDate>\
                  <maxRows>{maxrows}</maxRows>\
                  <recordsKind>All</recordsKind>\
                </GetDevicesData>\
              </soap:Body>\
            </soap:Envelope>';
        }
        static get getALlDevicesDataRequest(): string {
            return '<?xml version="1.0" encoding="utf-8"?>\
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
              <soap:Header>\
                <MSSSoapHeader xmlns="http://tempuri.org/">\
                  <Token>{token}</Token>\
                </MSSSoapHeader>\
              </soap:Header>\
              <soap:Body>\
                <GetAllDevicesData xmlns="http://tempuri.org/">\
                  <startDate>{startdatetime}</startDate>\
                  <endDate>{enddatetime}</endDate>\
                  <maxRows>{maxrows}</maxRows>\
                  <recordsKind>All</recordsKind>\
                </GetAllDevicesData>\
              </soap:Body>\
            </soap:Envelope>';
    }

    static get getAllDevicesDataByPageRequest():string{
      return '<?xml version="1.0" encoding="utf-8"?>\
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
        <soap:Header>\
          <MSSSoapHeader xmlns="http://tempuri.org/">\
            <Token>{token}</Token>\
          </MSSSoapHeader>\
        </soap:Header>\
        <soap:Body>\
          <GetAllDevicesDataByPage xmlns="http://tempuri.org/">\
          <startDate>{startdatetime}</startDate>\
          <endDate>{enddatetime}</endDate>\
          <maxRows>{maxrows}</maxRows>\
          <recordsKind>All</recordsKind>\
          <deviceHistoryId>{pagesize}</deviceHistoryId>\
          </GetAllDevicesDataByPage>\
        </soap:Body>\
      </soap:Envelope>';
    }
    static get getDevicesDataByPageRequest():string{
      return '<?xml version="1.0" encoding="utf-8"?>\
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
        <soap:Header>\
          <MSSSoapHeader xmlns="http://tempuri.org/">\
            <Token>{token}</Token>\
          </MSSSoapHeader>\
        </soap:Header>\
        <soap:Body>\
          <GetDevicesDataByPage xmlns="http://tempuri.org/">\
            <deviceIds>\
            {devicesIdsdata}\
            </deviceIds>\
          <startDate>{startdatetime}</startDate>\
          <endDate>{enddatetime}</endDate>\
          <maxRows>{maxrows}</maxRows>\
          <recordsKind>All</recordsKind>\
          <deviceHistoryId>{pagesize}</deviceHistoryId>\
          </GetDevicesDataByPage>\
        </soap:Body>\
      </soap:Envelope>';
    }
}
}