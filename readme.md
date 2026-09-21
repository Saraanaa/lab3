# F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест

## Lab 3 — Quality Scenarios → SLO → k6 Threshold

**Оюутны нэр:** [Саранчимэг]
**Оюутны код:** [B232274001]

**Технологи:**

* Node.js
* Express.js
* Grafana k6
* Git / GitHub

**k6 version:**

```text
k6 v2.2.0
```

**Тест хийх орчин:**

```text
API: http://localhost:3000
Virtual Users (VU): 20
```

---

# 1. Системийн тухай

Энэхүү лабораторийн ажлаар Node.js болон Express ашиглан локал API сервер үүсгэж, системийн чанарын шаардлагыг Quality Scenario хэлбэрээр тодорхойлон, тэдгээрийг SLO болон k6-ийн threshold болгон хэрэгжүүлсэн.

Систем нь дараах гурван үндсэн endpoint-тэй.

| Endpoint         | Тайлбар                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `POST /cart/add` | Сагсанд бараа нэмэх хурдан үйлдэл                                  |
| `GET /report`    | Тайлан буцаах бөгөөд 200–400 ms санамсаргүй delay-тэй              |
| `POST /pay`      | Төлбөр боловсруулах бөгөөд ойролцоогоор 5% нь HTTP 500 алдаа өгдөг |

---

# 2. Quality Scenarios

## Scenario 1 — `/cart/add` endpoint-ийн гүйцэтгэл

| 6 хэсэг               | Тодорхойлолт                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Overview**          | `/cart/add` endpoint нь хэрэглэгчийн сагсанд бараа нэмэх үед хурдан хариу өгөх шаардлагатай. |
| **System State**      | Сервер ажиллаж байгаа бөгөөд API хэвийн ажиллагаатай байна.                                  |
| **Environment State** | 20 virtual user нэгэн зэрэг системд хүсэлт илгээнэ. Тестийг 1 минут ажиллуулна.              |
| **External Stimulus** | Хэрэглэгчид `POST /cart/add` endpoint руу хүсэлт илгээнэ.                                    |
| **Required Response** | Сервер хүсэлтийг амжилттай боловсруулж, HTTP 200 хариу болон JSON response буцаана.          |
| **Measure**           | Response time-ийн p95 нь 200 ms-ээс бага байна.                                              |

### SLO

`/cart/add` endpoint-ийн response time-ийн **p95 < 200 ms** байна.

---

## Scenario 2 — `/pay` endpoint-ийн найдвартай байдал

| 6 хэсэг               | Тодорхойлолт                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Overview**          | `/pay` endpoint нь төлбөр боловсруулах үед алдаа багатай, тогтвортой ажиллах шаардлагатай.             |
| **System State**      | Сервер хэвийн ажиллаж байгаа бөгөөд `/pay` endpoint хүсэлт хүлээн авах боломжтой байна.                |
| **Environment State** | 20 virtual user 1 минутын турш төлбөрийн хүсэлт илгээнэ.                                               |
| **External Stimulus** | Хэрэглэгчид `POST /pay` endpoint руу төлбөрийн хүсэлт илгээнэ.                                         |
| **Required Response** | Амжилттай хүсэлт HTTP 200 хариу өгнө. Алдаатай хүсэлтийн хувь зөвшөөрөгдөх хэмжээнээс хэтрэхгүй байна. |
| **Measure**           | `/pay` endpoint-ийн error rate 8%-иас бага байна.                                                      |

### SLO

`/pay` endpoint-ийн **error rate < 8%** байна.

---

## Scenario 3 — Системийн availability

| 6 хэсэг               | Тодорхойлолт                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Overview**          | Систем нь хэрэглэгчийн хүсэлтийг аль болох тасралтгүй хүлээн авч, хариу өгөх шаардлагатай.                                       |
| **System State**      | API сервер ажиллаж байгаа бөгөөд бүх endpoint ашиглах боломжтой байна.                                                           |
| **Environment State** | 20 virtual user системд тасралтгүй хүсэлт илгээнэ. Тестийг 2 минут ажиллуулж, серверийг туршилтын үеэр 10 секунд зогсооно.       |
| **External Stimulus** | Серверийг 10 секунд зориудаар зогсоож, дараа нь дахин ажиллуулна.                                                                |
| **Required Response** | Сервер дахин ассаны дараа хүсэлтүүдийг дахин боловсруулах боломжтой байх ба нийт амжилттай хүсэлтийн хувь 90%-иас багагүй байна. |
| **Measure**           | Availability буюу амжилттай check-ийн хувь 90%-иас их байна.                                                                     |

### SLO

Нийт хүсэлтийн **availability ≥ 90%** байна.

---

# 3. SLO ба k6 Threshold

| Чанарын үзүүлэлт        | SLI               | SLO / Threshold | Test window |
| ----------------------- | ----------------- | --------------- | ----------- |
| `/cart/add` performance | Response time p95 | `< 200 ms`      | 1 минут     |
| `/pay` reliability      | Error rate        | `< 8%`          | 1 минут     |
| System availability     | Successful checks | `> 90%`         | 2 минут     |
| `/report` performance   | Response time p95 | `< 450 ms`      | 1 минут     |

## Threshold сонгосон үндэслэл

`/cart/add` нь хэрэглэгчийн шууд үйлдэлтэй холбоотой тул хурдан хариу өгөх шаардлагатай гэж үзэж p95 response time-ийн босгыг 200 ms болгосон.

`/pay` нь төлбөрийн үйлдэл учраас алдаа гаргах хувь бага байх шаардлагатай. Серверийн хэрэгжүүлэлтэд ойролцоогоор 5%-ийн алдаа зориудаар үүсдэг тул 8%-ийн босго сонгосон.

Availability-ийн SLO-г 90% гэж сонгосон бөгөөд сервер богино хугацаанд тасарсан үед системийн нийт хүртээмжийг хэмжихэд ашигласан.

`/report` endpoint нь сервер талдаа зориудаар 200–400 ms delay үүсгэдэг. Иймээс бодит хэрэгжүүлэлттэй нийцүүлэхийн тулд p95 response time-ийн босгыг 450 ms болгосон.

---

# 4. k6 PASS Test

PASS тестийг дараах тохиргоотой ажиллуулсан.

* Virtual Users: 20
* Duration: 1 минут
* `/cart/add` p95 threshold: `< 200 ms`
* `/pay` error rate threshold: `< 8%`
* Availability threshold: `> 90%`
* `/report` p95 threshold: `< 450 ms`

Бодит тестийн үр дүн:

| Үзүүлэлт              |    Үр дүн |      SLO | Үр дүн |
| --------------------- | --------: | -------: | ------ |
| `/cart/add` p95       |   2.60 ms | < 200 ms | PASS   |
| `/report` p95         | 398.59 ms | < 450 ms | PASS   |
| `/pay` error rate     |     4.23% |     < 8% | PASS   |
| Availability / checks |    98.58% |    > 90% | PASS   |

PASS тестийн бүрэн k6 текст гаралт:

```text
results/pass.txt
```

Файлд тухайн тестийн бүрэн k6 гаралт хадгалагдсан.

---

# 5. Error Budget

## Availability-ийн time-based error budget

Availability SLO:

```text
90%
```

PASS тестийн цонх:

```text
1 минут
```

Харин chaos тестийн цонх:

```text
2 минут = 120 секунд
```

2 минутын хугацаанд 90% availability шаардсан үед зөвшөөрөгдөх downtime:

```text
120 × (1 - 0.90) = 12 секунд
```

Иймээс time-based error budget:

**12 секунд**

байна.

Chaos тестийн үед серверийг **10 секунд** зориудаар зогсоосон. Энэ нь 12 секундийн time-based error budget-ээс бага боловч request-based availability нь 81.87% болсон.

Учир нь сервер унтарсан 10 секундийн хугацаанд зөвхөн хугацаа өнгөрөөгүй, олон virtual user олон хүсэлт илгээж байсан тул олон request амжилтгүй болсон.

## Request-based error budget

Availability SLO:

```text
≥ 90%
```

өөрөөр хэлбэл хамгийн ихдээ:

```text
10% request failure
```

зөвшөөрнө.

Chaos тестийн үр дүн:

```text
Total checks: 5739
Successful: 4699
Failed: 1040
Availability: 81.87%
```

Тэгэхээр:

```text
Allowed failed request rate = 10%
Actual failed request rate = 18.12%
```

Иймээс request-based error budget хэтэрсэн байна.

---

# 6. Chaos Test

Chaos тестийг 2 минутын турш 20 VU-тай ажиллуулсан.

Тестийн үеэр серверийг **10 секунд зогсоож**, дараа нь дахин ажиллуулсан.

## Chaos тестийн үр дүн

| Үзүүлэлт          |    Үр дүн |      SLO | Үр дүн |
| ----------------- | --------: | -------: | ------ |
| Нийт checks       |      5739 |        — | —      |
| Амжилттай checks  |      4699 |        — | —      |
| Failed checks     |      1040 |        — | —      |
| Availability      |    81.87% |    > 90% | FAIL   |
| `/pay` error rate |    20.90% |     < 8% | FAIL   |
| `/cart/add` p95   |   3.02 ms | < 200 ms | PASS   |
| `/report` p95     | 396.25 ms | < 450 ms | PASS   |

Chaos туршилтын бүрэн k6 текст гаралт:

```text
results/chaos.txt
```

### Chaos туршилтын тайлбар

Серверийг 10 секунд зогсоосны дараа availability **81.87%** болсон бөгөөд энэ нь 90%-ийн SLO-оос бага байна.

Мөн `/pay` endpoint-ийн error rate **20.90%** болж, 8%-ийн SLO-оос давсан.

Харин `/cart/add` endpoint-ийн p95 **3.02 ms**, `/report` endpoint-ийн p95 **396.25 ms** байсан тул тэдгээрийн performance SLO хангагдсан.

Энэ туршилт нь серверийн богино хугацааны тасалдал олон хэрэглэгчийн request-д зэрэг нөлөөлж, request-based availability-г бууруулж болохыг харуулсан.

---

# 7. Availability ба Reliability-ийн ялгаа

**Availability** нь систем тухайн үед хэрэглэгчийн хүсэлтийг хүлээн авч, үйлчилгээ үзүүлэх боломжтой байсан эсэхийг хэмждэг.

**Reliability** нь тодорхой үйлдэл тогтвортой, зөв ажиллаж, алдаа бага гаргаж байгаа эсэхийг хэмждэг.

Энэ лабораторийн ажилд availability-г нийт successful checks-ийн хувиар хэмжсэн.

Харин `/pay` endpoint-ийн reliability-г error rate-аар хэмжсэн.

Chaos туршилтын үед сервер бүрэн унтарсан тул availability буурсан.

Сервер унтарсан үед `/pay` хүсэлтүүд мөн амжилтгүй болсон учраас `/pay`-ийн хэмжигдсэн error rate өссөн.

---

# 8. FAIL Test

FAIL тестэд `/report` endpoint-ийн threshold-ийг зориудаар хэт хатуу болгож:

```text
p(95) < 100 ms
```

гэж тохируулсан.

Гэвч серверийн `/report` endpoint нь 200–400 ms-ийн санамсаргүй delay-тэй тул энэ threshold-ийг хангах боломжгүй.

## FAIL тестийн үр дүн

| Үзүүлэлт          |    Үр дүн | Threshold | Үр дүн |
| ----------------- | --------: | --------: | ------ |
| `/report` p95     | 408.14 ms |  < 100 ms | FAIL   |
| `/cart/add` p95   |  42.61 ms |  < 200 ms | PASS   |
| `/pay` error rate |     5.84% |      < 8% | PASS   |

k6 дараах threshold алдааг мэдээлсэн:

```text
ERRO[0061] thresholds on metrics 'http_req_duration{name:report}' have been crossed
```

Ингэснээр threshold бодитоор зөрчигдсөн үед k6 тестийг FAIL болгож байгааг баталгаажуулсан.

FAIL тестийн бүрэн гаралт:

```text
results/fail.txt
```

FAIL тестийн script:

```text
slo-test-fail.js
```

---

# 9. Error Budget-ийн дүгнэлт

PASS тестийн үед availability 98.58% байсан тул 90%-ийн SLO хангагдсан.

Chaos тестийн үед availability 81.87% болж, зөвшөөрөгдөх 10%-ийн failure budget-ээс давсан.

Time-based байдлаар 2 минутын тестэд 90% availability-ийн error budget нь 12 секунд байсан.

Серверийг 10 секунд зогсоосон нь энэ хугацааны budget-ээс бага боловч олон concurrent request амжилтгүй болсон учраас request-based availability 90%-иас доош орсон.

Иймээс time-based error budget болон request-based error budget нь ижил нөхцөлд өөр үр дүн үзүүлж болохыг туршилтаар харуулсан.

---

# 10. Үр дүнгийн файлууд

Repository-д k6-ийн бүрэн текст гаралтыг дараах файлуудаар хадгалсан.

```text
results/
├── pass.txt
├── chaos.txt
└── fail.txt
```

Эдгээр файлууд нь README-д дурдсан p95, error rate, availability зэрэг хэмжилтийн бодит k6 гаралтыг агуулна.

---

# 11. Төслийн бүтэц

```text
lab3/
├── server.js
├── slo-test.js
├── slo-test-fail.js
├── README.md
├── .gitignore
└── results/
    ├── pass.txt
    ├── chaos.txt
    └── fail.txt
```

`node_modules/` хавтас repository-д оруулаагүй бөгөөд `.gitignore`-д нэмсэн.

Багшийн өгсөн `.docx` зааврын файл repository-д оруулаагүй.

---

# 12. Git Commit History

Ажлын явцад үе шат бүрээр тусдаа commit хийсэн.

```text
95ef87a Add lab3 local API
bbb12d7 Add SLO pass test and results
020131f Update lab3 README
7408eda Add chaos test results
5ffbde7 Modify server downtime message in readme
69d120d Add fail test and results
```

Ингэснээр API боловсруулах, SLO болон PASS тест хийх, README боловсруулах, Chaos тест хийх, FAIL тест нэмэх зэрэг ажлын үе шатууд Git history-д тусдаа хадгалагдсан.

---

# 13. Дүгнэлт

Энэ лабораторийн ажлаар системийн чанарын шаардлагыг эхлээд Quality Scenario хэлбэрээр тодорхойлж, дараа нь хэмжигдэх SLO болгон хөрвүүлсэн.
Хамгийн хэцүү хэсэг нь чанарын ерөнхий шаардлагыг бодитой тоон босго буюу k6 threshold болгон тодорхойлох байсан.
Ялангуяа `/report` endpoint-ийн 200–400 ms delay болон `/pay` endpoint-ийн ойролцоогоор 5%-ийн алдааг харгалзан босго сонгох шаардлагатай байсан.
`/cart/add` endpoint-ийн p95 2.60 ms байсан тул 200 ms-ийн SLO-г хангаж чадсан.
`/pay` endpoint-ийн error rate 4.23% байсан нь 8%-ийн SLO-оос бага байсан тул PASS тест амжилттай болсон.
Chaos туршилтын үед серверийг 10 секунд зогсооход availability 81.87% болж, 90%-ийн SLO зөрчигдсөн.
Иймээс Chaos туршилт нь availability-ийн сценарийн хэмжүүрийг баталгаажуулж, системийн тасалдал олон request-д нөлөөлж болохыг харуулсан.
Мөн time-based 12 секундийн error budget болон request-based error budget нь өөрөөр тооцогдож болохыг туршилтаар ажигласан.
FAIL тестэд `/report` endpoint-ийн p95 threshold-ийг 100 ms болгож зориудаар зөрчүүлснээр k6 threshold зөрчигдөх үед тест FAIL болдгийг шалгасан.
Ингэснээр Quality Scenario → SLO → k6 Threshold гэсэн шаардлагын шат дарааллыг бодит систем дээр хэрэгжүүлж, performance, reliability болон availability хэмжүүрүүдийг туршиж үзсэн.

---

# 14. Ашигласан хэрэгслүүд

* Node.js
* Express.js
* Grafana k6 v2.2.0
* Git
* GitHub

Тестүүдийг зөвхөн локал сервер дээр:

```text
http://localhost:3000
```

ажиллуулсан.
