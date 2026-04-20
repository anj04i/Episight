from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date, lag
from pyspark.sql.window import Window

spark = SparkSession.builder.appName("OutbreakPrediction").getOrCreate()

print("Spark Started")

covid = spark.read.csv("data/covid.csv", header=True, inferSchema=True)
mobility = spark.read.csv("data/mobility.csv", header=True, inferSchema=True)

print("COVID rows:", covid.count())
print("Mobility rows:", mobility.count())

covid = covid.withColumn("Date", to_date(col("Date")))
mobility = mobility.withColumn("date", to_date(col("date")))

covid = covid.filter(col("Country") == "India")
mobility = mobility.filter(col("country_region") == "India")

print("COVID India rows:", covid.count())
print("Mobility India rows:", mobility.count())

mobility = mobility.withColumnRenamed("date", "Date")

df = covid.join(mobility, on="Date", how="inner")

print("After join:", df.count())

window = Window.orderBy("Date")

df = df.withColumn("prev_cases", lag("Confirmed").over(window))
df = df.withColumn("growth_rate", col("Confirmed") - col("prev_cases"))

df = df.fillna(0)

print("After fillna:", df.count())

df = df.select(
    col("Confirmed"),
    col("growth_rate"),
    col("retail_and_recreation_percent_change_from_baseline"),
    col("workplaces_percent_change_from_baseline"),
    col("residential_percent_change_from_baseline")
)

pdf = df.toPandas()

pdf.to_csv("data/processed.csv", index=False)

print("Preprocessing Completed")
print("Final dataset size:", len(pdf))