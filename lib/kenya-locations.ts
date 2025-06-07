export interface Constituency {
  id: string
  name: string
  countyId: string
}

export interface County {
  id: string
  name: string
  constituencies: Constituency[]
}

export const kenyaLocations: County[] = [
  {
    id: "nairobi",
    name: "Nairobi",
    constituencies: [
      { id: "westlands", name: "Westlands", countyId: "nairobi" },
      { id: "dagoretti-north", name: "Dagoretti North", countyId: "nairobi" },
      { id: "dagoretti-south", name: "Dagoretti South", countyId: "nairobi" },
      { id: "langata", name: "Langata", countyId: "nairobi" },
      { id: "kibra", name: "Kibra", countyId: "nairobi" },
      { id: "roysambu", name: "Roysambu", countyId: "nairobi" },
      { id: "kasarani", name: "Kasarani", countyId: "nairobi" },
      { id: "ruaraka", name: "Ruaraka", countyId: "nairobi" },
      { id: "embakasi-south", name: "Embakasi South", countyId: "nairobi" },
      { id: "embakasi-north", name: "Embakasi North", countyId: "nairobi" },
      { id: "embakasi-central", name: "Embakasi Central", countyId: "nairobi" },
      { id: "embakasi-east", name: "Embakasi East", countyId: "nairobi" },
      { id: "embakasi-west", name: "Embakasi West", countyId: "nairobi" },
      { id: "makadara", name: "Makadara", countyId: "nairobi" },
      { id: "kamukunji", name: "Kamukunji", countyId: "nairobi" },
      { id: "starehe", name: "Starehe", countyId: "nairobi" },
      { id: "mathare", name: "Mathare", countyId: "nairobi" },
    ],
  },
  {
    id: "mombasa",
    name: "Mombasa",
    constituencies: [
      { id: "changamwe", name: "Changamwe", countyId: "mombasa" },
      { id: "jomba", name: "Jomba", countyId: "mombasa" },
      { id: "kisauni", name: "Kisauni", countyId: "mombasa" },
      { id: "nyali", name: "Nyali", countyId: "mombasa" },
      { id: "likoni", name: "Likoni", countyId: "mombasa" },
      { id: "mvita", name: "Mvita", countyId: "mombasa" },
    ],
  },
  {
    id: "kwale",
    name: "Kwale",
    constituencies: [
      { id: "msambweni", name: "Msambweni", countyId: "kwale" },
      { id: "lungalunga", name: "Lungalunga", countyId: "kwale" },
      { id: "matuga", name: "Matuga", countyId: "kwale" },
      { id: "kinango", name: "Kinango", countyId: "kwale" },
    ],
  },
  {
    id: "kilifi",
    name: "Kilifi",
    constituencies: [
      { id: "kilifi-north", name: "Kilifi North", countyId: "kilifi" },
      { id: "kilifi-south", name: "Kilifi South", countyId: "kilifi" },
      { id: "kaloleni", name: "Kaloleni", countyId: "kilifi" },
      { id: "rabai", name: "Rabai", countyId: "kilifi" },
      { id: "ganze", name: "Ganze", countyId: "kilifi" },
      { id: "malindi", name: "Malindi", countyId: "kilifi" },
      { id: "magarini", name: "Magarini", countyId: "kilifi" },
    ],
  },
  {
    id: "tana-river",
    name: "Tana River",
    constituencies: [
      { id: "garsen", name: "Garsen", countyId: "tana-river" },
      { id: "galole", name: "Galole", countyId: "tana-river" },
      { id: "bura", name: "Bura", countyId: "tana-river" },
    ],
  },
  {
    id: "lamu",
    name: "Lamu",
    constituencies: [
      { id: "lamu-east", name: "Lamu East", countyId: "lamu" },
      { id: "lamu-west", name: "Lamu West", countyId: "lamu" },
    ],
  },
  {
    id: "taita-taveta",
    name: "Taita Taveta",
    constituencies: [
      { id: "taveta", name: "Taveta", countyId: "taita-taveta" },
      { id: "wundanyi", name: "Wundanyi", countyId: "taita-taveta" },
      { id: "mwatate", name: "Mwatate", countyId: "taita-taveta" },
      { id: "voi", name: "Voi", countyId: "taita-taveta" },
    ],
  },
  {
    id: "garissa",
    name: "Garissa",
    constituencies: [
      { id: "garissa-township", name: "Garissa Township", countyId: "garissa" },
      { id: "balambala", name: "Balambala", countyId: "garissa" },
      { id: "lagdera", name: "Lagdera", countyId: "garissa" },
      { id: "dadaab", name: "Dadaab", countyId: "garissa" },
      { id: "fafi", name: "Fafi", countyId: "garissa" },
      { id: "ijara", name: "Ijara", countyId: "garissa" },
    ],
  },
  {
    id: "wajir",
    name: "Wajir",
    constituencies: [
      { id: "wajir-north", name: "Wajir North", countyId: "wajir" },
      { id: "wajir-east", name: "Wajir East", countyId: "wajir" },
      { id: "tarbaj", name: "Tarbaj", countyId: "wajir" },
      { id: "wajir-west", name: "Wajir West", countyId: "wajir" },
      { id: "eldas", name: "Eldas", countyId: "wajir" },
      { id: "wajir-south", name: "Wajir South", countyId: "wajir" },
    ],
  },
  {
    id: "mandera",
    name: "Mandera",
    constituencies: [
      { id: "mandera-west", name: "Mandera West", countyId: "mandera" },
      { id: "banissa", name: "Banissa", countyId: "mandera" },
      { id: "mandera-north", name: "Mandera North", countyId: "mandera" },
      { id: "mandera-south", name: "Mandera South", countyId: "mandera" },
      { id: "mandera-east", name: "Mandera East", countyId: "mandera" },
      { id: "lafey", name: "Lafey", countyId: "mandera" },
    ],
  },
  {
    id: "marsabit",
    name: "Marsabit",
    constituencies: [
      { id: "moyale", name: "Moyale", countyId: "marsabit" },
      { id: "north-horr", name: "North Horr", countyId: "marsabit" },
      { id: "saku", name: "Saku", countyId: "marsabit" },
      { id: "laisamis", name: "Laisamis", countyId: "marsabit" },
    ],
  },
  {
    id: "isiolo",
    name: "Isiolo",
    constituencies: [
      { id: "isiolo-north", name: "Isiolo North", countyId: "isiolo" },
      { id: "isiolo-south", name: "Isiolo South", countyId: "isiolo" },
    ],
  },
  {
    id: "meru",
    name: "Meru",
    constituencies: [
      { id: "igembe-south", name: "Igembe South", countyId: "meru" },
      { id: "igembe-central", name: "Igembe Central", countyId: "meru" },
      { id: "igembe-north", name: "Igembe North", countyId: "meru" },
      { id: "tigania-west", name: "Tigania West", countyId: "meru" },
      { id: "tigania-east", name: "Tigania East", countyId: "meru" },
      { id: "north-imenti", name: "North Imenti", countyId: "meru" },
      { id: "buuri", name: "Buuri", countyId: "meru" },
      { id: "central-imenti", name: "Central Imenti", countyId: "meru" },
      { id: "south-imenti", name: "South Imenti", countyId: "meru" },
    ],
  },
  {
    id: "tharaka-nithi",
    name: "Tharaka Nithi",
    constituencies: [
      { id: "tharaka", name: "Tharaka", countyId: "tharaka-nithi" },
      { id: "chuka-igambang-ombe", name: "Chuka Igambang'ombe", countyId: "tharaka-nithi" },
      { id: "maara", name: "Maara", countyId: "tharaka-nithi" },
    ],
  },
  {
    id: "embu",
    name: "Embu",
    constituencies: [
      { id: "manyatta", name: "Manyatta", countyId: "embu" },
      { id: "runyenjes", name: "Runyenjes", countyId: "embu" },
      { id: "mbeere-south", name: "Mbeere South", countyId: "embu" },
      { id: "mbeere-north", name: "Mbeere North", countyId: "embu" },
    ],
  },
  {
    id: "kitui",
    name: "Kitui",
    constituencies: [
      { id: "mwingi-north", name: "Mwingi North", countyId: "kitui" },
      { id: "mwingi-central", name: "Mwingi Central", countyId: "kitui" },
      { id: "mwingi-west", name: "Mwingi West", countyId: "kitui" },
      { id: "kitui-east", name: "Kitui East", countyId: "kitui" },
      { id: "kitui-west", name: "Kitui West", countyId: "kitui" },
      { id: "kitui-central", name: "Kitui Central", countyId: "kitui" },
      { id: "kitui-rural", name: "Kitui Rural", countyId: "kitui" },
      { id: "kitui-south", name: "Kitui South", countyId: "kitui" },
    ],
  },
  {
    id: "machakos",
    name: "Machakos",
    constituencies: [
      { id: "machakos-town", name: "Machakos Town", countyId: "machakos" },
      { id: "mavoko", name: "Mavoko", countyId: "machakos" },
      { id: "kathiani", name: "Kathiani", countyId: "machakos" },
      { id: "machakos-rural", name: "Machakos Rural", countyId: "machakos" },
      { id: "kangundo", name: "Kangundo", countyId: "machakos" },
      { id: "matungulu", name: "Matungulu", countyId: "machakos" },
      { id: "mwala", name: "Mwala", countyId: "machakos" },
      { id: "yatta", name: "Yatta", countyId: "machakos" },
    ],
  },
  {
    id: "makueni",
    name: "Makueni",
    constituencies: [
      { id: "makueni", name: "Makueni", countyId: "makueni" },
      { id: "kaiti", name: "Kaiti", countyId: "makueni" },
      { id: "kibwezi-west", name: "Kibwezi West", countyId: "makueni" },
      { id: "kibwezi-east", name: "Kibwezi East", countyId: "makueni" },
      { id: "kilome", name: "Kilome", countyId: "makueni" },
      { id: "mbooni", name: "Mbooni", countyId: "makueni" },
    ],
  },
  {
    id: "nyandarua",
    name: "Nyandarua",
    constituencies: [
      { id: "kinangop", name: "Kinangop", countyId: "nyandarua" },
      { id: "kipipiri", name: "Kipipiri", countyId: "nyandarua" },
      { id: "ol-kalou", name: "Ol Kalou", countyId: "nyandarua" },
      { id: "ol-jorok", name: "Ol Jorok", countyId: "nyandarua" },
      { id: "ndaragwa", name: "Ndaragwa", countyId: "nyandarua" },
    ],
  },
  {
    id: "nyeri",
    name: "Nyeri",
    constituencies: [
      { id: "tetu", name: "Tetu", countyId: "nyeri" },
      { id: "kieni", name: "Kieni", countyId: "nyeri" },
      { id: "mathira", name: "Mathira", countyId: "nyeri" },
      { id: "othaya", name: "Othaya", countyId: "nyeri" },
      { id: "mukurweini", name: "Mukurweini", countyId: "nyeri" },
      { id: "nyeri-town", name: "Nyeri Town", countyId: "nyeri" },
    ],
  },
  {
    id: "kirinyaga",
    name: "Kirinyaga",
    constituencies: [
      { id: "mwea", name: "Mwea", countyId: "kirinyaga" },
      { id: "gichugu", name: "Gichugu", countyId: "kirinyaga" },
      { id: "ndia", name: "Ndia", countyId: "kirinyaga" },
      { id: "kirinyaga-central", name: "Kirinyaga Central", countyId: "kirinyaga" },
    ],
  },
  {
    id: "murang-a",
    name: "Murang'a",
    constituencies: [
      { id: "kangema", name: "Kangema", countyId: "murang-a" },
      { id: "mathioya", name: "Mathioya", countyId: "murang-a" },
      { id: "kiharu", name: "Kiharu", countyId: "murang-a" },
      { id: "kigumo", name: "Kigumo", countyId: "murang-a" },
      { id: "maragwa", name: "Maragwa", countyId: "murang-a" },
      { id: "kandara", name: "Kandara", countyId: "murang-a" },
      { id: "gatanga", name: "Gatanga", countyId: "murang-a" },
    ],
  },
  {
    id: "kiambu",
    name: "Kiambu",
    constituencies: [
      { id: "gatundu-south", name: "Gatundu South", countyId: "kiambu" },
      { id: "gatundu-north", name: "Gatundu North", countyId: "kiambu" },
      { id: "juja", name: "Juja", countyId: "kiambu" },
      { id: "thika-town", name: "Thika Town", countyId: "kiambu" },
      { id: "ruiru", name: "Ruiru", countyId: "kiambu" },
      { id: "githunguri", name: "Githunguri", countyId: "kiambu" },
      { id: "kiambu", name: "Kiambu", countyId: "kiambu" },
      { id: "kiambaa", name: "Kiambaa", countyId: "kiambu" },
      { id: "kabete", name: "Kabete", countyId: "kiambu" },
      { id: "kikuyu", name: "Kikuyu", countyId: "kiambu" },
      { id: "limuru", name: "Limuru", countyId: "kiambu" },
      { id: "lari", name: "Lari", countyId: "kiambu" },
    ],
  },
  {
    id: "turkana",
    name: "Turkana",
    constituencies: [
      { id: "turkana-north", name: "Turkana North", countyId: "turkana" },
      { id: "turkana-west", name: "Turkana West", countyId: "turkana" },
      { id: "turkana-central", name: "Turkana Central", countyId: "turkana" },
      { id: "turkana-south", name: "Turkana South", countyId: "turkana" },
      { id: "turkana-east", name: "Turkana East", countyId: "turkana" },
      { id: "loima", name: "Loima", countyId: "turkana" },
    ],
  },
  {
    id: "west-pokot",
    name: "West Pokot",
    constituencies: [
      { id: "kapenguria", name: "Kapenguria", countyId: "west-pokot" },
      { id: "sigor", name: "Sigor", countyId: "west-pokot" },
      { id: "kacheliba", name: "Kacheliba", countyId: "west-pokot" },
      { id: "pokot-south", name: "Pokot South", countyId: "west-pokot" },
    ],
  },
  {
    id: "samburu",
    name: "Samburu",
    constituencies: [
      { id: "samburu-west", name: "Samburu West", countyId: "samburu" },
      { id: "samburu-north", name: "Samburu North", countyId: "samburu" },
      { id: "samburu-east", name: "Samburu East", countyId: "samburu" },
    ],
  },
  {
    id: "trans-nzoia",
    name: "Trans Nzoia",
    constituencies: [
      { id: "cherangany", name: "Cherangany", countyId: "trans-nzoia" },
      { id: "endebess", name: "Endebess", countyId: "trans-nzoia" },
      { id: "saboti", name: "Saboti", countyId: "trans-nzoia" },
      { id: "kiminini", name: "Kiminini", countyId: "trans-nzoia" },
      { id: "kwanza", name: "Kwanza", countyId: "trans-nzoia" },
    ],
  },
  {
    id: "uasin-gishu",
    name: "Uasin Gishu",
    constituencies: [
      { id: "soy", name: "Soy", countyId: "uasin-gishu" },
      { id: "turbo", name: "Turbo", countyId: "uasin-gishu" },
      { id: "moiben", name: "Moiben", countyId: "uasin-gishu" },
      { id: "ainabkoi", name: "Ainabkoi", countyId: "uasin-gishu" },
      { id: "kapseret", name: "Kapseret", countyId: "uasin-gishu" },
      { id: "kesses", name: "Kesses", countyId: "uasin-gishu" },
    ],
  },
  {
    id: "elgeyo-marakwet",
    name: "Elgeyo Marakwet",
    constituencies: [
      { id: "marakwet-east", name: "Marakwet East", countyId: "elgeyo-marakwet" },
      { id: "marakwet-west", name: "Marakwet West", countyId: "elgeyo-marakwet" },
      { id: "keiyo-north", name: "Keiyo North", countyId: "elgeyo-marakwet" },
      { id: "keiyo-south", name: "Keiyo South", countyId: "elgeyo-marakwet" },
    ],
  },
  {
    id: "nandi",
    name: "Nandi",
    constituencies: [
      { id: "tinderet", name: "Tinderet", countyId: "nandi" },
      { id: "aldai", name: "Aldai", countyId: "nandi" },
      { id: "nandi-hills", name: "Nandi Hills", countyId: "nandi" },
      { id: "chesumei", name: "Chesumei", countyId: "nandi" },
      { id: "emgwen", name: "Emgwen", countyId: "nandi" },
      { id: "mosop", name: "Mosop", countyId: "nandi" },
    ],
  },
  {
    id: "baringo",
    name: "Baringo",
    constituencies: [
      { id: "baringo-north", name: "Baringo North", countyId: "baringo" },
      { id: "baringo-central", name: "Baringo Central", countyId: "baringo" },
      { id: "baringo-south", name: "Baringo South", countyId: "baringo" },
      { id: "mogotio", name: "Mogotio", countyId: "baringo" },
      { id: "eldama-ravine", name: "Eldama Ravine", countyId: "baringo" },
      { id: "tiaty", name: "Tiaty", countyId: "baringo" },
    ],
  },
  {
    id: "laikipia",
    name: "Laikipia",
    constituencies: [
      { id: "laikipia-west", name: "Laikipia West", countyId: "laikipia" },
      { id: "laikipia-east", name: "Laikipia East", countyId: "laikipia" },
      { id: "laikipia-north", name: "Laikipia North", countyId: "laikipia" },
    ],
  },
  {
    id: "nakuru",
    name: "Nakuru",
    constituencies: [
      { id: "molo", name: "Molo", countyId: "nakuru" },
      { id: "njoro", name: "Njoro", countyId: "nakuru" },
      { id: "naivasha", name: "Naivasha", countyId: "nakuru" },
      { id: "gilgil", name: "Gilgil", countyId: "nakuru" },
      { id: "kuresoi-south", name: "Kuresoi South", countyId: "nakuru" },
      { id: "kuresoi-north", name: "Kuresoi North", countyId: "nakuru" },
      { id: "subukia", name: "Subukia", countyId: "nakuru" },
      { id: "rongai", name: "Rongai", countyId: "nakuru" },
      { id: "bahati", name: "Bahati", countyId: "nakuru" },
      { id: "nakuru-town-west", name: "Nakuru Town West", countyId: "nakuru" },
      { id: "nakuru-town-east", name: "Nakuru Town East", countyId: "nakuru" },
    ],
  },
  {
    id: "narok",
    name: "Narok",
    constituencies: [
      { id: "kajiado-west", name: "Kajiado West", countyId: "narok" },
      { id: "kajiado-north", name: "Kajiado North", countyId: "narok" },
      { id: "kajiado-central", name: "Kajiado Central", countyId: "narok" },
      { id: "kajiado-east", name: "Kajiado East", countyId: "narok" },
      { id: "kajiado-south", name: "Kajiado South", countyId: "narok" },
      { id: "narok-north", name: "Narok North", countyId: "narok" },
      { id: "narok-east", name: "Narok East", countyId: "narok" },
      { id: "narok-south", name: "Narok South", countyId: "narok" },
      { id: "narok-west", name: "Narok West", countyId: "narok" },
      { id: "kilgoris", name: "Kilgoris", countyId: "narok" },
    ],
  },
  {
    id: "kajiado",
    name: "Kajiado",
    constituencies: [
      { id: "kajiado-west", name: "Kajiado West", countyId: "kajiado" },
      { id: "kajiado-north", name: "Kajiado North", countyId: "kajiado" },
      { id: "kajiado-central", name: "Kajiado Central", countyId: "kajiado" },
      { id: "kajiado-east", name: "Kajiado East", countyId: "kajiado" },
      { id: "kajiado-south", name: "Kajiado South", countyId: "kajiado" },
    ],
  },
  {
    id: "kericho",
    name: "Kericho",
    constituencies: [
      { id: "kipkelion-east", name: "Kipkelion East", countyId: "kericho" },
      { id: "kipkelion-west", name: "Kipkelion West", countyId: "kericho" },
      { id: "ainamoi", name: "Ainamoi", countyId: "kericho" },
      { id: "bureti", name: "Bureti", countyId: "kericho" },
      { id: "belgut", name: "Belgut", countyId: "kericho" },
      { id: "sigowet-soin", name: "Sigowet Soin", countyId: "kericho" },
    ],
  },
  {
    id: "bomet",
    name: "Bomet",
    constituencies: [
      { id: "sotik", name: "Sotik", countyId: "bomet" },
      { id: "chepalungu", name: "Chepalungu", countyId: "bomet" },
      { id: "bomet-east", name: "Bomet East", countyId: "bomet" },
      { id: "bomet-central", name: "Bomet Central", countyId: "bomet" },
      { id: "konoin", name: "Konoin", countyId: "bomet" },
    ],
  },
  {
    id: "kakamega",
    name: "Kakamega",
    constituencies: [
      { id: "lugari", name: "Lugari", countyId: "kakamega" },
      { id: "likuyani", name: "Likuyani", countyId: "kakamega" },
      { id: "malava", name: "Malava", countyId: "kakamega" },
      { id: "lurambi", name: "Lurambi", countyId: "kakamega" },
      { id: "navakholo", name: "Navakholo", countyId: "kakamega" },
      { id: "mumias-west", name: "Mumias West", countyId: "kakamega" },
      { id: "mumias-east", name: "Mumias East", countyId: "kakamega" },
      { id: "matungu", name: "Matungu", countyId: "kakamega" },
      { id: "khwisero", name: "Khwisero", countyId: "kakamega" },
      { id: "shinyalu", name: "Shinyalu", countyId: "kakamega" },
      { id: "ikolomani", name: "Ikolomani", countyId: "kakamega" },
      { id: "butere", name: "Butere", countyId: "kakamega" },
    ],
  },
  {
    id: "vihiga",
    name: "Vihiga",
    constituencies: [
      { id: "vihiga", name: "Vihiga", countyId: "vihiga" },
      { id: "sabatia", name: "Sabatia", countyId: "vihiga" },
      { id: "hamisi", name: "Hamisi", countyId: "vihiga" },
      { id: "luanda", name: "Luanda", countyId: "vihiga" },
      { id: "emuhaya", name: "Emuhaya", countyId: "vihiga" },
    ],
  },
  {
    id: "bungoma",
    name: "Bungoma",
    constituencies: [
      { id: "mt-elgon", name: "Mt Elgon", countyId: "bungoma" },
      { id: "sirisia", name: "Sirisia", countyId: "bungoma" },
      { id: "kabuchai", name: "Kabuchai", countyId: "bungoma" },
      { id: "bumula", name: "Bumula", countyId: "bungoma" },
      { id: "kanduyi", name: "Kanduyi", countyId: "bungoma" },
      { id: "webuye-east", name: "Webuye East", countyId: "bungoma" },
      { id: "webuye-west", name: "Webuye West", countyId: "bungoma" },
      { id: "kimilili", name: "Kimilili", countyId: "bungoma" },
      { id: "tongaren", name: "Tongaren", countyId: "bungoma" },
    ],
  },
  {
    id: "busia",
    name: "Busia",
    constituencies: [
      { id: "teso-north", name: "Teso North", countyId: "busia" },
      { id: "teso-south", name: "Teso South", countyId: "busia" },
      { id: "nambale", name: "Nambale", countyId: "busia" },
      { id: "matayos", name: "Matayos", countyId: "busia" },
      { id: "butula", name: "Butula", countyId: "busia" },
      { id: "funyula", name: "Funyula", countyId: "busia" },
      { id: "budalangi", name: "Budalangi", countyId: "busia" },
    ],
  },
  {
    id: "siaya",
    name: "Siaya",
    constituencies: [
      { id: "ugenya", name: "Ugenya", countyId: "siaya" },
      { id: "ugunja", name: "Ugunja", countyId: "siaya" },
      { id: "alego-usonga", name: "Alego Usonga", countyId: "siaya" },
      { id: "gem", name: "Gem", countyId: "siaya" },
      { id: "bondo", name: "Bondo", countyId: "siaya" },
      { id: "rarieda", name: "Rarieda", countyId: "siaya" },
    ],
  },
  {
    id: "kisumu",
    name: "Kisumu",
    constituencies: [
      { id: "kisumu-east", name: "Kisumu East", countyId: "kisumu" },
      { id: "kisumu-west", name: "Kisumu West", countyId: "kisumu" },
      { id: "kisumu-central", name: "Kisumu Central", countyId: "kisumu" },
      { id: "seme", name: "Seme", countyId: "kisumu" },
      { id: "nyando", name: "Nyando", countyId: "kisumu" },
      { id: "muhoroni", name: "Muhoroni", countyId: "kisumu" },
      { id: "nyakach", name: "Nyakach", countyId: "kisumu" },
    ],
  },
  {
    id: "homa-bay",
    name: "Homa Bay",
    constituencies: [
      { id: "kasipul", name: "Kasipul", countyId: "homa-bay" },
      { id: "kabondo-kasipul", name: "Kabondo Kasipul", countyId: "homa-bay" },
      { id: "karachuonyo", name: "Karachuonyo", countyId: "homa-bay" },
      { id: "rangwe", name: "Rangwe", countyId: "homa-bay" },
      { id: "homa-bay-town", name: "Homa Bay Town", countyId: "homa-bay" },
      { id: "ndhiwa", name: "Ndhiwa", countyId: "homa-bay" },
      { id: "suba-north", name: "Suba North", countyId: "homa-bay" },
      { id: "suba-south", name: "Suba South", countyId: "homa-bay" },
    ],
  },
  {
    id: "migori",
    name: "Migori",
    constituencies: [
      { id: "rongo", name: "Rongo", countyId: "migori" },
      { id: "awendo", name: "Awendo", countyId: "migori" },
      { id: "suna-east", name: "Suna East", countyId: "migori" },
      { id: "suna-west", name: "Suna West", countyId: "migori" },
      { id: "uriri", name: "Uriri", countyId: "migori" },
      { id: "nyatike", name: "Nyatike", countyId: "migori" },
      { id: "kuria-west", name: "Kuria West", countyId: "migori" },
      { id: "kuria-east", name: "Kuria East", countyId: "migori" },
    ],
  },
  {
    id: "kisii",
    name: "Kisii",
    constituencies: [
      { id: "bonchari", name: "Bonchari", countyId: "kisii" },
      { id: "south-mugirango", name: "South Mugirango", countyId: "kisii" },
      { id: "bomachoge-borabu", name: "Bomachoge Borabu", countyId: "kisii" },
      { id: "bobasi", name: "Bobasi", countyId: "kisii" },
      { id: "bomachoge-chache", name: "Bomachoge Chache", countyId: "kisii" },
      { id: "nyaribari-masaba", name: "Nyaribari Masaba", countyId: "kisii" },
      { id: "nyaribari-chache", name: "Nyaribari Chache", countyId: "kisii" },
      { id: "kitutu-chache-north", name: "Kitutu Chache North", countyId: "kisii" },
      { id: "kitutu-chache-south", name: "Kitutu Chache South", countyId: "kisii" },
    ],
  },
  {
    id: "nyamira",
    name: "Nyamira",
    constituencies: [
      { id: "kitutu-masaba", name: "Kitutu Masaba", countyId: "nyamira" },
      { id: "west-mugirango", name: "West Mugirango", countyId: "nyamira" },
      { id: "north-mugirango", name: "North Mugirango", countyId: "nyamira" },
      { id: "borabu", name: "Borabu", countyId: "nyamira" },
    ],
  },
]

export function getCountyById(countyId: string): County | undefined {
  return kenyaLocations.find((county) => county.id === countyId)
}

export function getConstituencyById(constituencyId: string): Constituency | undefined {
  for (const county of kenyaLocations) {
    const constituency = county.constituencies.find((c) => c.id === constituencyId)
    if (constituency) return constituency
  }
  return undefined
}

export function getConstituenciesByCounty(countyId: string): Constituency[] {
  const county = getCountyById(countyId)
  return county ? county.constituencies : []
}

export function searchLocations(query: string): { counties: County[]; constituencies: Constituency[] } {
  const lowerQuery = query.toLowerCase()

  const counties = kenyaLocations.filter((county) => county.name.toLowerCase().includes(lowerQuery))

  const constituencies: Constituency[] = []
  for (const county of kenyaLocations) {
    for (const constituency of county.constituencies) {
      if (constituency.name.toLowerCase().includes(lowerQuery)) {
        constituencies.push(constituency)
      }
    }
  }

  return { counties, constituencies }
}
