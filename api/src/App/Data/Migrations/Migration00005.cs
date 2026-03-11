using FluentMigrator;

namespace Shop.Data.Migrations;

[Migration(0000500)]
public class AddNewsletterSubscriberTable : Migration
{
    public override void Up()
    {
        Create.Table("NewsletterSubscriber")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Email").AsString().NotNullable().Unique()
            .WithColumn("IsActive").AsBoolean().NotNullable();
    }

    public override void Down()
    {
    }
}