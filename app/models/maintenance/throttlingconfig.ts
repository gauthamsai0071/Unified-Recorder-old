export class ThrottlingDD
{
    Text: string;
    Value: string;

    constructor()
    {
        this.Text = null;
        this.Value = null;
    }
}

export class Throttling
{
    DistanceMaximum: ThrottlingDD[];
    DistanceMinimum: ThrottlingDD[];
    IntervalAbsolute: ThrottlingDD[];
    IntervalRelative: ThrottlingDD[];

    constructor(){
        this.DistanceMaximum = [];
        this.DistanceMinimum = [];
        this.IntervalAbsolute = [];
        this.IntervalRelative = [];
    }
}

export class ThrottlingConfiguration
{
    Distance: string;
    Interval: string;
    IntervalAbsoluteVal: string;
    IntervalRelativeVal: string;
    DistanceMinimumVal: string;
    DistanceMaximumVal: string;

    constructor()
    {
        this.Distance = null;
        this.Interval = null;
        this.IntervalAbsoluteVal = null;
        this.IntervalRelativeVal = null;
        this.DistanceMinimumVal = null;
        this.DistanceMaximumVal = null;
    }
}