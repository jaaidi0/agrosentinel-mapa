// Data-source abstraction. Every implementation exposes the same
// {start, stop} interface and pushes payloads through the same callback,
// so swapping polling for a real-time stream later doesn't touch map/render code.

export class PollingDataSource {
  constructor(url, intervalMs) {
    this.url = url;
    this.intervalMs = intervalMs;
    this._timer = null;
  }

  start(onData, onError) {
    var url = this.url;
    function tick() {
      fetch(url)
        .then(function (res) { return res.json(); })
        .then(onData)
        .catch(onError);
    }
    tick();
    this._timer = setInterval(tick, this.intervalMs);
  }

  stop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
  }
}

// Ready for the backend to expose a stream: same start/stop contract as
// PollingDataSource, backed by Server-Sent Events instead of polling.
export class SseDataSource {
  constructor(url) {
    this.url = url;
    this._source = null;
  }

  start(onData, onError) {
    this._source = new EventSource(this.url);
    this._source.onmessage = function (event) {
      onData(JSON.parse(event.data));
    };
    this._source.onerror = onError;
  }

  stop() {
    if (this._source) this._source.close();
    this._source = null;
  }
}

export function createDataSource(station) {
  if (station.stream === 'sse') {
    return new SseDataSource(station.url);
  }
  return new PollingDataSource(station.url, station.pollIntervalMs || 30000);
}
