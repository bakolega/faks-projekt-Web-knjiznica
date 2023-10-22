# Projektne faze
- [x] - Opis projekta
- [x] - Početna struktura aplikacije
- [x] - Prototip
- [x] - Konzultacije
- [x] - Finalna verzija
- [ ] - Obrana projekta

## Opis projekta
Potrebno je napisati kratki opis projekta.
Opis mora sadržavati popis funkcionalnosti koje će biti implementirane (npr. "prijava korisnika", "unos novih poruka", "pretraživanje poruka po autoru" itd...)
Napraviti ću aplikaciju za praćenje osobnih prihoda i rashoda. Kroz aplikaciju će se moći ...

## Početna struktura aplikacije
Potrebno je inicijalizirati početnu strukturu backend i frontend aplikacija.
Aplikacije moraju biti u odvojenim mapama koje su već inicijalizirane.
Ukoliko radite aplikaciju sa statičkim frontend sadržajem, onda u mapi mora biti izvorni kôd aplikacije

## Prototip
U ovoj fazi bi trebali imati "grubu" verziju svoje aplikacije. Ova verzija bi trebala imati implementirane osnovne funkcionalnosti koje su navedene u opisu projekta. Ne očekuje se da su implementirane SVE funkcionalnosti niti da su postojeće funkcionalnosti potpuno ispravne.

## Konzultacije
Nakon izrade prototipa potrebno se javiti nastavniku za termin konzultacija. Na konzultacijama ćete ukratko pokazati svoj prototip te će se po potrebi napraviti modifikacija početnih zahtjeva. Dovršeni projekti bez ove faze neće biti prihvaćeni.

## Finalna verzija
Nakon demonstracije prototipa možete nastaviti sa razvojem aplikacije i implementacijom svih funkcionalnosti. Prilikom razvoja potrebno je voditi dnevnik aktivnosti prema zadanim uputama.

## Obrana projekta
Zadnja faza je obrana projekta - nakon završetka finalne verzije svoje aplikacije javite se nastavniku za dogovor oko termina obrane projekta.

# Opis projekta
## Kratki opis
Napravit ću aplikacija za knjižnicu (katalog) s odvojenim funkcionalnostima za članove i knjižničare. Omogućivat će pregled i uređivanje kataloga te posuđivanje, produživanje, povrat i rezervaciju (ukoliko nije dostupna) knjiga. Također knjižničari će moći dodavati nove članove te evidentirati plaćanje njihove članarine, što će članovi moći vidjeti za sebe
## Tehnologije
1. Frontend - React
2. Backend - Express
3. Baza - Mongo
## Popis funkcionalnosti
1. Prelged kataloga (pretraga, sortiranje, dodavanje knjiga)
2. Različite uloge (knjizničar, član) 
3. Posuđivanje i povrat (i eventualna zakasnina) - vrši knjižničar
4. Rezervacija, pregled posuđenog (produživanje,rokovi i eventualne zakasnine),  - vrši član
5. Dodavanje korisničkih računa - vrši knjižničar
6. Evidencija i rokovi plačanja članarine
