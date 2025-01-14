var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("QuizMaser")
    .WithDataVolume();

builder.AddProject<Projects.QuizMaster>("quizmaster")
    .WithReference(sql);

builder.Build().Run();
