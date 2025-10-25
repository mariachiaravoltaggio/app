using GestionaleCN;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddWebServices(builder);

var allowedOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
                     ?? new[] { "https://localhost:4200" };
builder.Services.AddCors(options => 
options.AddPolicy("Dev", builder => builder
    .WithOrigins(allowedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gestor V1");
    });
}
app.UseCors("Dev");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers().RequireCors("Dev");

app.Run();
