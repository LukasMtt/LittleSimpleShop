using Riok.Mapperly.Abstractions;

using Shop.ApiModels;
using Shop.Data.DataModels;

[Mapper]
public partial class MetadataMapper
{
    public partial MetadataModel MetadataToMetadataModel(Metadata metadata);
}