Lokalizacja geoportal.gov.pl w Google Maps
----------------------------------------

**Instalacja**

[Chrome Web Store](https://chrome.google.com/webstore/detail/lokalizacja-geoportalgovp/bmalpmchldgpfnonnkephcfpblhipdhm)


**Użycie**
1. Odwiedź https://mapy.geoportal.gov.pl
1. Poczekaj na pełne załadowanie strony (na dole będzie widać koordynaty zmieniające się wraz z poruszanym kursorem)
1. Nakieruj kursor na dowolne miejsce na mapie
1. Wciśnij skrót `Alt+Shift+D`  
    (można go zmienić w opcjach rozszerzenia)
1. Otworzy się nowa karta ze stronę Google Maps w wybranej lokalizacji


**Przygotowanie paczki do releasu**

1. Podbij wersję w `manifest.json`
2. `(cd src && zip -r ../geoportalgovpl-to-googlemaps.zip .)`