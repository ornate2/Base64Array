service BinaryImage {
    action uploadImages() returns array of Binary;

    @cds.persistence.exists 
    entity Images {
        key ID   : UUID;
        name     : String;
        imageUrl : String;
    };

    entity ImageSet as projection on Images;   
}