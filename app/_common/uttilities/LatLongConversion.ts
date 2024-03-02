export function ConvertLatitudeToDMS(n: number) {
    // The sign doesn't matter
    n = Math.abs(n);
    // Get the degrees
    var d = Math.floor(n);
    // Strip off the answer we already have
    n = n - d;
    // And then put the minutes before the '.'
    n *= 60;
    // Get the minutes
    var m = Math.floor(n);
    // Remove them from the answer
    n = n - m;
    // Put the seconds before the '.'
    n *= 60;
    // Get the seconds
    // Should this be round? Or rounded by special rules?
    var s = n.toFixed(4);
    var dir = n >= 0 ? "N" : "S";
    // Put it together.
    return "" + d + dir + " " + m + "' " + s + "\"";

}

export function ConvertLongitudeToDMS(n: number) {
    // The sign doesn't matter
    n = Math.abs(n);
    // Get the degrees
    var d = Math.floor(n);
    // Strip off the answer we already have
    n = n - d;
    // And then put the minutes before the '.'
    n *= 60;
    // Get the minutes
    var m = Math.floor(n);
    // Remove them from the answer
    n = n - m;
    // Put the seconds before the '.'
    n *= 60;
    // Get the seconds      
    var s = n.toFixed(4);
    var dir = n >= 0 ? "E" : "W";
    // Put it together.
    return "" + d + dir + " " + m + "' " + s + "\"";
}
