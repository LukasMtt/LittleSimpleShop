namespace Shop.Data.Migrations;

[Migration(0000600)]
public class AddIndexesToTables : Migration
{
    public override void Up()
    {
        Create.Index("IX_Cart_CartToken")
            .OnTable("Cart")
            .OnColumn("CartToken");

        Create.Index("IX_CartItem_ProductId")
            .OnTable("CartItem")
            .OnColumn("ProductId");
        Create.Index("IX_CartItem_CartId")
            .OnTable("CartItem")
            .OnColumn("CartId");

        Create.Index("IX_Document_OrderId")
            .OnTable("Document")
            .OnColumn("OrderId");

        Create.Index("IX_Order_OrderToken")
            .OnTable("Order")
            .OnColumn("OrderToken");
        Create.Index("IX_Order_CartId")
            .OnTable("Order")
            .OnColumn("CartId");
        Create.Index("IX_Order_ShipmentTargetId")
            .OnTable("Order")
            .OnColumn("ShipmentTargetId");

        Create.Index("IX_OrderEmail_OrderId")
            .OnTable("OrderEmail")
            .OnColumn("OrderId");

        Create.Index("IX_OrderProduct_OrderId")
            .OnTable("OrderProduct")
            .OnColumn("OrderId");
        Create.Index("IX_OrderProduct_ProductId")
            .OnTable("OrderProduct")
            .OnColumn("ProductId");

        Create.Index("IX_Product_CategoryId")
            .OnTable("Product")
            .OnColumn("CategoryId");

        Create.Index("IX_PublicImage_CategoryId")
            .OnTable("PublicImage")
            .OnColumn("CategoryId");
        Create.Index("IX_PublicImage_ProductId")
            .OnTable("PublicImage")
            .OnColumn("ProductId");

        Create.Index("IX_ShipmentTarget_AddressId")
            .OnTable("ShipmentTarget")
            .OnColumn("AddressId");
    }

    public override void Down()
    {
    }
}