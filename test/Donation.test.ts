import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { Donation } from "../typechain-types";

describe("Lock", function () {
  let donation: Donation;

  before(async function () {
    [this.owner, this.addr1, ...this.addrs] = await ethers.getSigners();
    const Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy();
    const creatorAddress = "0xCa870fe4B8bdC2a8B369C671B9A44b2C6FFf6AF6";
    let creator // Adresse de test

    describe("Deployment", function () {
      // On teste la création d'un créateur
      it("Should create a creator", async function () {
        await donation.registerCreator("TestCreator", "je teste", creatorAddress);
        creator = await donation.getCreator(creatorAddress);
        expect(creator.name).to.equal("TestCreator");
        expect(creator.description).to.equal("je teste");
        expect(creator.balance).to.equal(0);
      });

      // On teste la donation (méthode la plus importante)
      it("Should emit NewMessageFromDonor event and update creator balance on donation", async function () {
        const donationAmount = ethers.parseEther("1.0");
        const donorName = "Alice";
        const donorMessage = "Force mon reuf";

        await expect(donation.donation(donorName, donorMessage, this.addr1.address)).to.emit(donation, "NewMessageFromDonor");

        creator = await donation.getCreator(creatorAddress);
        expect(creator.balance).to.equal(donationAmount);
      });

      // it("Should withdraw creator balance", async function () {
      //   donation.withdraw()
      //   const creator = await donation.getCreator(creatorAddress);
      //   expect(creator.balance).to.equal(0);
      // });

    })
  });
});
