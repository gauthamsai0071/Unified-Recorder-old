export module Constants.EndPoints {
    export class Login {
        static EndPoint = '/mes/MESWebService.asmx?op=MSSLogin';
        static MotoLocatorPortNo = '/mes/MESWebService.asmx?op=getMotolocatorAPIPort';
    }

    export class Logout {
        static EndPoint = '/mes/MESWebService.asmx?op=MSSLogout';
    }

    export class EventType {
        static AddEndPoint = '/mes/MESWebService.asmx?op=addEventType';
        static GetEventTypeListEndPoint = '/mes/MESWebService.asmx?op=getEventTypes';
        static GetEventTypeGroupEndPoint = '/mes/MESWebService.asmx?op=getEventTypeAvailableGroups';
        static UpdateEventTypeEndPoint = '/mes/MESWebService.asmx?op=updateEventType';
        static RemoveEvenTypeEndPoint = '/mes/MESWebService.asmx?op=removeEventType';
        static GetTemplateSeveritiesEndPoint = '/mes/MESWebService.asmx?op=getTemplateSeverities';
        static GetSeveritiesForEventTypeEndPoint = '/mes/MESWebService.asmx?op=getSeveritiesForEventType';
        static GetSeverityLevelsEndPoint = '/mes/MESWebService.asmx?op=getSeverityLevels';
        static RemoveSeverityFromTemplateEndPoint = '/mes/MESWebService.asmx?op=removeSeverityFromTemplate';
        static AddSeverityToTemplateEndPoint = '/mes/MESWebService.asmx?op=addSeverityToTemplate';
        static GetSeverityActionsEndPoint = '/mes/MESWebService.asmx?op=getSeverityActions';
        static CreateActionEndPoint = '/mes/MESWebService.asmx?op=createAction';
        static UpdateActionEndPoint = '/mes/MESWebService.asmx?op=updateAction';
        static AddActionToSeverityEndPoint = '/mes/MESWebService.asmx?op=addActionToSeverity';
        static RemoveActionFromSeverityEndPoint = '/mes/MESWebService.asmx?op=removeActionFromSeverity';
        static AddNewSeverityEndPoint = '/mes/MESWebService.asmx?op=addSeverityLevel';
        static UpdateSeverityEndPoint = '/mes/MESWebService.asmx?op=updateSeverity';
        static RemoveSeverityEndPoint = '/mes/MESWebService.asmx?op=removeSeverity';
        static GetSeverityAvailableGroupsEndPoint = '/mes/MESWebService.asmx?op=getSeverityAvailableGroups';
        static GetActionAvailableGroupsEndPoint = '/mes/MESWebService.asmx?op=getSeverityAvailableGroups';
        static GetEventListEndPoint = '/mes/MESWebService.asmx?op=getEventList';
        static AcknowledgeEventEndPoint = '/mes/MESWebService.asmx?op=acknowledgeEvent';
        static RemoveEventEndPoint = '/mes/MESWebService.asmx?op=removeEvent';
    }

    export class MBSLogin {
        static MBSEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=MSSLogin';
    }

    export class MBSLogout {
        static MBSEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=MSSLogout';
    }
    export class BoundaryService{
        static GetValidityPeriodsEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=GetValidityPeriods';
        static RemoveValidityPeriodEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=RemoveValidityPeriod';
        static AddValidityPeriodsEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=AddValidityPeriod';
        static UpdateValidityPeriodsEndPoint = '/mbs/MBSBoundaryCondition.asmx?op=UpdateValidityPeriod';
    }

    export class ArchiveService{
        static GetDeviceEndPoint = '/maw/MAWWebServices.asmx?op=GetDevicesData';
        static GetAllDevicesEndPoint = '/maw/MAWWebServices.asmx?op=GetAllDevicesData';
        static GetDeviceByPageEndPoint = '/maw/MAWWebServices.asmx?op=GetDevicesDataByPage';
        static GetAllDevicesByPageEndPoint = '/maw/MAWWebServices.asmx?op=GetAllDevicesDataByPage';
    }
}