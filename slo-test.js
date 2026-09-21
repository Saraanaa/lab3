import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20,
    duration: '1m',

    thresholds: {
        // Performance SLO
        'http_req_duration{name:cart}': ['p(95)<200'],

        // Reliability SLO
        'http_req_failed{name:pay}': ['rate<0.08'],

        // Availability SLO
        'checks': ['rate>0.90'],

        // Additional /report threshold
        'http_req_duration{name:report}': ['p(95)<450'],
    },
};

export default function () {
    const base = 'http://localhost:3000';

    // Performance: /cart/add
    const cart = http.post(
        `${base}/cart/add`,
        null,
        {
            tags: {
                name: 'cart',
            },
        }
    );

    // Additional performance: /report
    const report = http.get(
        `${base}/report`,
        {
            tags: {
                name: 'report',
            },
        }
    );

    // Reliability: /pay
    const pay = http.post(
        `${base}/pay`,
        null,
        {
            tags: {
                name: 'pay',
            },
        }
    );

    check(cart, {
        'cart 200': (r) => r.status === 200,
    });

    check(report, {
        'report 200': (r) => r.status === 200,
    });

    check(pay, {
        'pay 200': (r) => r.status === 200,
    });

    sleep(1);
}