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

    GetStatusKeluargaMiskinAngka(data) {
        if(data.q7 / data.rgn_district.jumlahkeluarga >= 0.6 || data.q6 / data.rgn_district.jumlahkeluarga >= 0.6) {
            return 5;
        } else if(data.q5 / data.rgn_district.jumlahkeluarga >= 0.6 || data.q4 / data.rgn_district.jumlahkeluarga >= 0.6) {
            return 4;
        } else if(data.q3 / data.rgn_district.jumlahkeluarga >= 0.6) {
            return 3;
        } else if(data.q2 / data.rgn_district.jumlahkeluarga >= 0.6) {
            return 2;
        } else if(data.q1 / data.rgn_district.jumlahkeluarga >= 0.6) {
            return 1;
        } else {
            return 0;
        }
    }
}

module.exports = new Laporan;