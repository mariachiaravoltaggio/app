using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using GestionaleCN.Data;

namespace GestionaleCN;
public static class DependecyInjection
{

    public static IServiceCollection AddWebServices(this IServiceCollection services, WebApplicationBuilder build)
    {

     
        services.AddHttpContextAccessor();
        services.AddControllers();
        //    .AddJsonOptions(x =>
        //{
        //    // serialize enums as strings in api responses
        //    x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

        //    // ignore omitted parameters on models to enable optional params
        //    x.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        //});
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Gestor",
                Version = "v1"
            });
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            c.IncludeXmlComments(xmlPath);

            c.AddSecurityDefinition("Bearer",
                new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter into field the word 'Bearer' following by space and JWT",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });

        });

        var sqlConnectionString = build.Configuration.GetConnectionString("ConnectionString");

        if (!string.IsNullOrWhiteSpace(sqlConnectionString))
        {
            services.AddDbContext<NcDbContext>(options => options.UseSqlServer(sqlConnectionString)
                .EnableSensitiveDataLogging() // per vedere i parametri
                .LogTo(Console.WriteLine, LogLevel.Information) // logging su console
            );
        }

        services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
        {
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        return services;
    }

}
