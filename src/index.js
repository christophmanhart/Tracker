const db = firebase.firestore();

db.collection("Getraenke").get().then(value => {
    const docs = value.docs;
    for (let i = 0; i < docs.length; i++) {
        const snapshot = docs[i];
        CreateTableEntryForItem(snapshot);
    }
    CreateCharts(docs);
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

            if(!isNumeric(uncheckedMenge)){
                alert('Bitte nur Zahlen eingeben! 🤢');
                return;
            }

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

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function CreateTableEntryForItem(snapshot){

    const data = snapshot.data();
    console.log(data.id);
    const bestand = data['bestand'];
    const gewuenschteMenge = data['gewuenschteMenge'];
    const differenz = bestand - gewuenschteMenge;
    const nachkaufen = differenz > 0 ? 'Nein' : 'Ja!';

    //sorte
    $('#sorten').append(`<th>${snapshot.id}</td>`);

    //bestand
    $('#bestaende').append(`<th>${bestand}</td>`);

    //Menge
    $('#min-menge').append(`<th>${gewuenschteMenge}</td>`);

    //differenz
    $('#diff').append(`<th>${differenz}</td>`);

    //nachkaufen
    $('#nachkaufen').append(`<th>${nachkaufen}</td>`);

}

function CreateCharts(docs){
    const ctx = document.getElementById('bestand-chart').getContext('2d');
    const labels = docs.map(value => value.id);
    const data = docs.map(value => value.data()['bestand']);
    const colors = labels.map(_ => GetRandomColor());
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Alkohol Bestand',
                data: data,
                backgroundColor: colors,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function GetRandomColor(){
    return `rgba(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)}, 0.2)`;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}