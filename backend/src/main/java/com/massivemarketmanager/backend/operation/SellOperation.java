package com.massivemarketmanager.backend.operation;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("SELL")
public class SellOperation extends Operation {
}
