const firebaseConfig = {
    apiKey: "AIzaSyD6mIN2RjGLihi15-W-IlWZhP8z1JDqkH8",
    authDomain: "alkoholdatenbank.firebaseapp.com",
    databaseURL: "https://alkoholdatenbank-default-rtdb.firebaseio.com",
    projectId: "alkoholdatenbank",
    storageBucket: "alkoholdatenbank.appspot.com",
    messagingSenderId: "142784195708",
    appId: "1:142784195708:web:e87fca0cdf84507c342df9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


db.collection("Getraenke").get().then(value => {

    const ids = [
        ['bierbestand', 'biermin', 'differenzbier', 'nachkaufenbier'],
        ['weinbestand', 'weinmin', 'differenzwein', 'nachkaufenwein'],
    ];
    const docs = value.docs;
    for (let i = 0; i < docs.length; i++) {
        const data = docs[i].data();
        console.log(data);
        const bestand = data['bestand'];
        const gewuenschteMenge = data['gewuenschteMenge'];
        const differenz = bestand - gewuenschteMenge;
        const nachkaufen = differenz > 0 ? 'Nein' : 'Ja!';

        const localId = ids[i];

        //bestand
        $('#' + localId[0]).text(bestand);

        //Menge
        $('#' + localId[1]).text(gewuenschteMenge);

        //differenz
        $('#' + localId[2]).text(differenz);

        //nachkaufen
        $('#' + localId[3]).text(nachkaufen);

    }
    db
        .collection("DateCheck")
        .doc("Date")
        .get()
        .then(value => {
            const datum = value.data()["Monat"];
            const heute = new Date();
            if (datum < heute.getMonth() || (heute.getMonth() == 11 && datum.getMonth() == 0)) {
                db
                    .collection("DateCheck")
                    .doc("Date")
                    .update({
                        'Monat': heute.getMonth()//Januar ist Null

                    })
                db
                    .collection("Getraenke")
                    .doc("Bier")
                    .update({
                        'Gesamtverbrauch': 0

                    })
                db
                    .collection("Getraenke")
                    .doc("Wein")
                    .update({
                        'Gesamtverbrauch': 0
                    })
            }
        });
    ermittleLiebling();

});

        $('#buchenButton').on('click', () => {

            const uncheckedMenge = $('#quantity').val();
            let menge = 0;
            if (uncheckedMenge > 50) {
                alert('DIGGA WAS HAST DU VOR? 🤢');
                return;
            } else if (uncheckedMenge < -50) {
                alert('KEINER TRINKT SO VIEL!');
                return;
            } else
                menge = uncheckedMenge;


            const kategorie = $('#getraenkeauswahl').val();

            db
                .collection("Getraenke")
                .doc(kategorie)
                .get()
                .then(value => {
                    const aktVerbrauch = value.data()['Gesamtverbrauch'];
                    const aktuellerBestand = value.data()['bestand'];
                    const neuerBestand = parseInt(aktuellerBestand) + parseInt(menge);
                    db
                        .collection("Getraenke")
                        .doc(kategorie)
                        .update({
                            'bestand': neuerBestand
                        }).then(value => {
                        console.log("Wurde Eingetragen");
                        location.reload();
                    })
                    if (menge < 0) {
                        db
                            .collection("Getraenke")
                            .doc(kategorie)
                            .update({
                                'Gesamtverbrauch': aktVerbrauch + (parseInt(menge) * -1)
                            })
                    }
            ermittleLiebling();

        });
});
        function ermittleLiebling(){
            var bier = -1;
            var wein = -1
            db
                .collection("Getraenke")
                .doc("Bier")
                .get()
                .then(value => {
                    bier = value.data()['Gesamtverbrauch'];
                    console.log(bier);

                    db
                        .collection("Getraenke")
                        .doc("Wein")
                        .get()
                        .then(value => {
                            wein = value.data()['Gesamtverbrauch'];
                            console.log(wein);
                            if((wein*8.5)<(bier*5)){
                                document.getElementById('liebling').innerHTML = ("Bier: " + bier + "l")
                            }
                            else{
                                document.getElementById('liebling').innerHTML = ("Wein: " + wein + "l")
                            }
                        });
                });
        }