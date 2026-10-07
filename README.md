# structured-logging-lab

This repository contains a simple Orders API application for the DevOps Foundation assignment: Implementing Structured Logging for Debugging (LU 5.3).

## Setup

```bash
docker compose up -d
```

## View Logs

```bash
docker logs orders-api
```

## Trace a Request

```bash
curl -i localhost:3000/simulate-error
docker logs orders-api | jq 'select(.level == "error")'
docker logs orders-api | jq 'select(.reqId == "<request-id-from-error-log>")'
```

Every HTTP response includes its correlation ID in the `X-Request-ID` header. Request events, route events, database events, and payment events include that same `reqId`. The simulated error endpoint returns HTTP 500 and emits an `error` event.

The original service emitted unstructured startup and route messages such as `starting`, `ok`, `error happened`, and `done`. New events are one JSON object per line with `ts`, `level`, `service`, and `msg`, plus request context when they belong to an HTTP request. Request bodies, credentials, and database parameters are not logged.

See [CLOUD_LOGGING.md](CLOUD_LOGGING.md) for mapping these fields to a hosted log service.
