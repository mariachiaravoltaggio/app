// GeocodingService.cs
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;
namespace GestionaleCN.Services;
public sealed class GeocodingService
{
    private readonly IHttpClientFactory _http;
    private readonly IMemoryCache _cache;

    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public GeocodingService(IHttpClientFactory http, IMemoryCache cache)
    {
        _http = http;
        _cache = cache;
    }

    public async Task<object> ForwardAsync(string query, string country = "it")
    {
        if (string.IsNullOrWhiteSpace(query)) return Array.Empty<object>();

        var cacheKey = $"geocode:{country}:{query.Trim().ToLower()}";
        if (_cache.TryGetValue(cacheKey, out object? cached)) return cached!;

        var client = _http.CreateClient("nominatim");
        // NB: usa &addressdetails=1 per campi strutturati, &limit=5 per autocomplete
        var url = $"search?format=json&addressdetails=1&limit=5&countrycodes={country}&q={Uri.EscapeDataString(query)}";

        // breve delay per rispettare policy quando hai picchi di richieste
        await Task.Delay(150);

        using var resp = await client.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadAsStringAsync();
        var parsed = JsonSerializer.Deserialize<object>(json, JsonOpts)!;

        _cache.Set(cacheKey, parsed, TimeSpan.FromMinutes(15));
        return parsed;
    }

    public async Task<object?> ReverseAsync(double lat, double lon)
    {
        var cacheKey = $"reverse:{lat:F6}:{lon:F6}";
        if (_cache.TryGetValue(cacheKey, out object? cached)) return cached!;

        var client = _http.CreateClient("nominatim");
        var url = $"reverse?format=json&addressdetails=1&zoom=18&lat={lat.ToString(System.Globalization.CultureInfo.InvariantCulture)}&lon={lon.ToString(System.Globalization.CultureInfo.InvariantCulture)}";

        await Task.Delay(150);

        using var resp = await client.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadAsStringAsync();
        var parsed = JsonSerializer.Deserialize<object>(json, JsonOpts)!;

        _cache.Set(cacheKey, parsed, TimeSpan.FromMinutes(60));
        return parsed;
    }
}

