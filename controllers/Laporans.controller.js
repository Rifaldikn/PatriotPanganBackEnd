class Laporan {
    constructor() {

    }

    GetStatusKeluargaMiskin(data) {
        if(data.q7 || data.q6) {
            return 'Rawan 5';
        } else if(data.q5 || data.q4) {
            return 'Rawan 4';
        } else if(data.q3) {
            return 'Rawan 3';
        } else if(data.q2) {
            return 'Rawan 2';
        } else if(data.q1) {
            return 'Rawan 1';
        } else {
            return 'Aman';
        }
    }
}

module.exports = new Laporan;