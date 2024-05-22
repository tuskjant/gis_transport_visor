export function formatDuration(duration: number): string {
    let formatDuration: string;
    var minDur = duration / 60;
    var hourDur = 0;
    if (minDur < 60) {
        formatDuration = minDur.toFixed(1) + " min."
    } else {
        hourDur = Math.floor(minDur / 60)
        minDur = minDur % 60
        formatDuration = hourDur.toString() + " h " + minDur.toFixed(0) + " min."
    }
        
    return formatDuration;
}

export function formatDistance(distance: number): string {
        let formatDist: string;
        if (distance > 1000) {
            formatDist = (distance / 1000).toFixed(2) + " Km.";
        } else {
            formatDist = distance.toString() + " m.";
        }
        return formatDist;
    }