angular.module('app', []);
angular.module('app').controller('validationController', ['$scope', function($scope) {
    // Initiate variables
    $scope.type = 'Unknown';                     // Card type (e.g. VISA, MasterCard)
    $scope.icon = ["fa", "fa-question-circle"];  // Icon for the card type
    $scope.validity = "Invalid";                 // Validity of card number
    $scope.formInvalid = true;                   // Validity of the form

    // ================= Validate inputs =================
    // Validate the card number
    $scope.validateCard = function() {
        // Get card type
        if ($scope.card && $scope.card.length) {
            switch ($scope.card.charAt(0)) {
                case '4':
                    $scope.type = 'VISA';
                    $scope.icon = ["fa", "fa-cc-visa"];
                    if ($scope.card.length >= 13 && $scope.card.length <= 16 && $scope.luhnCheck($scope.card) == true) {
                        $scope.validity = 'Valid';
                    } else {
                        $scope.validity = "Invalid";
                    }
                    break;
                case '5':
                    $scope.type = 'MasterCard';
                    $scope.icon = ["fa", "fa-cc-mastercard"];
                    if ($scope.card.length == 16 && $scope.luhnCheck($scope.card) == true) {
                        $scope.validity = "Valid";
                    } else {
                        $scope.validity = "Invalid";
                    }
                    break;
                case '3':
                    if ($scope.card.charAt(1) == "4" || $scope.card.charAt(1) == "7") {
                        $scope.type = 'American Express';
                        $scope.icon = ["fa", "fa-credit-card-alt"];
                        if ($scope.card.length == 15 && $scope.luhnCheck($scope.card) == true) {
                            $scope.validity = "Valid";
                        } else {
                            $scope.validity = "Invalid";
                        }
                    } else {
                        $scope.type = 'Unknown';
                        $scope.validity = "Invalid";
                        $scope.icon = ["fa", "fa-question-circle"];
                    }
                    break;
                default:
                    $scope.type = 'Unknown';
                    $scope.validity = "Invalid";
                    $scope.icon = ["fa", "fa-question-circle"];
                    break;
            }
            if ($scope.validity == "Invalid") {
                $scope.cardform.card.$setValidity("card", false);
            } else {
                $scope.cardform.card.$setValidity("card", true);
            }
        } else {
            $scope.type = 'Unknown';
            $scope.validity = "Invalid";
            $scope.icon = ["fa", "fa-question-circle"];
        }
    }

    // Validate the expiry date
    $scope.validateExpiry = function() {
        if ($scope.expiry && $scope.expiry.match(/^\d{2}\/\d{2}$/)) {
            $scope.cardform.expiry.$setValidity("expiry", true);
            return true;
        } else {
            $scope.cardform.expiry.$setValidity("expiry", false);
            return false;
        }
    }

    // Validate the CVV
    $scope.validateCVV = function() {
        if ($scope.cvv && $scope.cvv.match(/^\d{3}$/)) {
            $scope.cardform.cvv.$setValidity("cvv", true);
            return true;
        } else {
            $scope.cardform.cvv.$setValidity("cvv", false);
            return false;
        }
    }

    // ================= Validate and submit form =================
    // Check if the form is valid
    $scope.checkFormValidity = function() {
        $scope.formInvalid = true;
        if ($scope.validity == "Invalid") return false;
        else if (!$scope.cardform.nameoncard.$valid) return false;
        else if (!$scope.validateExpiry()) return false;
        else if (!$scope.validateCVV()) return false;
        else {
            $scope.formInvalid = false;
            return true;
        }
    }

    // Submit the form (currently not really used)
    $scope.submitForm = function() {
        if ($scope.checkFormValidity() == true) {
            console.log("Submit");
        }
    }

    // ================= Helping functions =================
    // Luhn Algorithm Check (https://gist.github.com/ShirtlessKirk/2134376)
    $scope.luhnCheck = (function(arr) {
        return function(ccNum) {
            var
                len = ccNum.length,
                bit = 1,
                sum = 0,
                val;

            while (len) {
                val = parseInt(ccNum.charAt(--len), 10);
                sum += (bit ^= 1) ? arr[val] : val;
            }

            return sum && sum % 10 === 0;
        };
    }([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]));
}]);
