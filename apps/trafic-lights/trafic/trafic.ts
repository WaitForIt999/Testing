import * as trafic_colours from '../colours/trafic_colours'
import * as trafic_time from '../time/trafic_time'

const trafic = {
    colours: trafic_colours,
    time: trafic_time
}

const trafic_intersection = {
    car: {
        colour: trafic.colours.trafic_car_colours,
        time: trafic.time
    },
    pedestrian: {
        colour: trafic.colours.trafic_pedestrian_colours,
        time: trafic.time
    },
    bicycle: {
        colour: trafic.colours.trafic_bicycle_colours,
        time: trafic.time
    },
    turning: {
        colour: trafic.colours.trafic_turning_colours,
        time: trafic.time
    }
}
export { trafic_intersection }
