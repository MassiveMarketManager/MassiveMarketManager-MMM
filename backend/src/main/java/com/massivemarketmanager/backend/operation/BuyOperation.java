package com.massivemarketmanager.backend.operation;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("BUY")
public class BuyOperation extends Operation {
}
