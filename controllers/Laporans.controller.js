class Laporan {
    constructor() {

    }

    GetStatusKeluargaMiskin(data) {
        if(data.q7 == 1 || data.q6 == 1) {
            return 'Rawan 5';
        } else if(data.q5 == 1 || data.q4 == 1) {
            return 'Rawan 4';
        } else if(data.q3 == 1) {
            return 'Rawan 3';
        } else if(data.q2 == 1) {
            return 'Rawan 2';
        } else if(data.q1 == 1) {
            return 'Rawan 1';
        } else {
            return 'Aman';
        }
    }
}

module.exports = new Laporan;