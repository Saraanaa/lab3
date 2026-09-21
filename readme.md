Performance тестээр /cart/add endpoint-ийн хэвийн ачааллын үеийн хариу өгөх хугацааг хэмжсэн. Тестийг 20 virtual user (VU)-ээр 1 минут ажиллуулсан. SLO-г p95 response time < 200 ms гэж тодорхойлсон. Энэ босгыг сонгосон шалтгаан нь хэрэглэгчийн сагсанд бараа нэмэх үйлдэл хурдан хариу өгөх шаардлагатай байдагтай холбоотой.
 SLO тестийг 20 VU-ээр 1 минут ажиллуулахад /cart/add endpoint-ийн p95 response time 2.60 ms байсан бөгөөд 200 ms-ийн SLO-г хангасан. /pay endpoint-ийн error rate 4.23% байсан нь 8%-ийн босгоос бага байв. Нийт check-ийн амжилтын хувь 98.58% байсан тул availability-ийн 90%-ийн SLO мөн хангагдсан. Нэмэлтээр /report endpoint-ийн p95 response time 398.59 ms байсан бөгөөд 450 ms-ийн threshold-ийг хангасан. Иймээс хэвийн ачааллын нөхцөлд бүх тодорхойлсон threshold амжилттай биелсэн.
 Chaos Test – Үр дүн
 Тестийн хугацаа: 2 минут
 VU: 20
 Нийт request: 5739
 Амжилттай: 4699
 Failed: 1040
 Availability: 81.87% →  SLO > 90% биелээгүй
 /pay error rate: 20.90% →  SLO < 8% биелээгүй
 /cart/add p95: 3.02ms →  SLO < 200ms
 /report p95: 396.25ms →  SLO < 450ms
 Серверийг 10 секунд зогсоож, дахин асаасан.
 10 секундийн server downtime нь олон failed request үүсгэснээр request-based availability 81.87% болсон.
 2 минутын 90% availability-ийн time-based error budget = 12 секунд.
 Chaos үед /pay error rate өссөн нь серверийн тасалдал /pay хүсэлтүүдэд мөн нөлөөлсөнтэй холбоотой.