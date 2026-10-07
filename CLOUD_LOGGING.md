# Cloud Logging Mapping

The API writes one JSON object per line to stdout. Container platforms can collect these lines and parse their JSON fields without changing application code.

In Google Cloud Logging, the JSON fields are available as `jsonPayload` fields. For example, filter errors with `jsonPayload.level="error"` or follow a request with `jsonPayload.reqId="<request-id>"`. Map `level` to the platform's severity field if the collection pipeline does not do so automatically.

In Grafana Loki, ingest the container stdout stream with a JSON parser, then query fields with LogQL, for example `{container="orders-api"} | json | level="error"` or `{container="orders-api"} | json | reqId="<request-id>"`. Keep high-cardinality values such as `reqId` as parsed fields rather than indexed Loki labels.

The service deliberately omits secrets, credentials, request bodies, and payment data. This note describes field mapping only; no cloud resources or deployments are required.